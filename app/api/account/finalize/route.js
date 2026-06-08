import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { isThrowawayDomain } from '@/lib/throwaway-domains';

export async function POST(request) {
  const supabase = await createClient();
  const admin = await createAdminClient();

  const { data: { user }, error: sessionError } = await supabase.auth.getUser();
  if (sessionError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const secret = process.env.IDENTITY_SECRET;
  if (!secret) {
    console.error('IDENTITY_SECRET not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch { /* fingerprint is optional */ }

  const { fingerprint } = body;

  // Read email from Supabase auth before we do anything else
  const { data: authUser, error: userError } = await admin.auth.admin.getUserById(user.id);
  if (userError || !authUser?.user?.email) {
    return NextResponse.json({ error: 'Could not retrieve account details' }, { status: 400 });
  }

  const rawEmail = authUser.user.email.trim().toLowerCase();

  // Block throwaway email domains
  if (isThrowawayDomain(rawEmail)) {
    await admin.auth.admin.deleteUser(user.id);
    return NextResponse.json(
      { error: 'Disposable email addresses are not allowed. Please use a real email address.' },
      { status: 422 }
    );
  }

  // Handle double-submit — account already exists for this session
  const { data: existingAccount } = await admin
    .from('accounts')
    .select('account_id, verification_tag')
    .eq('account_id', user.id)
    .maybeSingle();

  if (existingAccount) {
    return NextResponse.json({ verificationTag: existingAccount.verification_tag });
  }

  // One-way hash of the email — this is what we store, never the raw address
  const emailHash = createHmac('sha256', secret)
    .update(`email:${rawEmail}`)
    .digest('hex');

  // One-way hash of the device fingerprint — used as a soft duplicate signal
  const deviceHash = fingerprint && fingerprint !== 'unknown'
    ? createHmac('sha256', secret).update(`device:${fingerprint}`).digest('hex')
    : null;

  // Check if this email has already been used for another account
  const { data: existingEmail } = await admin
    .from('verified_identifiers')
    .select('id')
    .eq('identifier_hash', emailHash)
    .maybeSingle();

  if (existingEmail) {
    await admin.auth.admin.deleteUser(user.id);
    return NextResponse.json(
      { error: 'An account already exists for this email address.' },
      { status: 409 }
    );
  }

  // Check device fingerprint — soft block (same device has registered before)
  if (deviceHash) {
    const { data: existingDevice } = await admin
      .from('accounts')
      .select('account_id')
      .eq('device_hash', deviceHash)
      .maybeSingle();

    if (existingDevice) {
      await admin.auth.admin.deleteUser(user.id);
      return NextResponse.json(
        {
          error:
            'An account has already been created from this device. ' +
            'If you share this device with someone else, contact us for help.',
        },
        { status: 409 }
      );
    }
  }

  // Store email hash in verified_identifiers
  const { error: identifierError } = await admin.from('verified_identifiers').insert({
    identifier_hash: emailHash,
    method: 'email',
  });

  if (identifierError) {
    // Race condition — another request beat us to it
    await admin.auth.admin.deleteUser(user.id);
    return NextResponse.json(
      { error: 'An account already exists for this email address.' },
      { status: 409 }
    );
  }

  // Create the anonymous account record
  await admin.from('accounts').insert({
    account_id: user.id,
    verification_tag: 'email',
    is_verified: true,
    device_hash: deviceHash,
  });

  return NextResponse.json({ verificationTag: 'email' });
}
