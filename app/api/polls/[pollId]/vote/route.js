import { createHash, createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getPollById } from '@/lib/polls';

export async function POST(request, { params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in to vote' }, { status: 401 });
  }

  const { pollId } = await params;
  const poll = getPollById(pollId);
  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { choice, deviceSalt } = body;

  if (!choice || !poll.options.find((o) => o.label === choice)) {
    return NextResponse.json({ error: 'Invalid choice' }, { status: 400 });
  }

  if (!deviceSalt || typeof deviceSalt !== 'string' || deviceSalt.length < 16) {
    return NextResponse.json({ error: 'Invalid device salt' }, { status: 400 });
  }

  const admin = await createAdminClient();

  // Verify the account exists and is verified
  const { data: account } = await admin
    .from('accounts')
    .select('verification_tag, is_verified')
    .eq('account_id', user.id)
    .maybeSingle();

  if (!account?.is_verified) {
    return NextResponse.json(
      { error: 'Verify your identity before voting.' },
      { status: 403 }
    );
  }

  const serverPepper = process.env.VOTE_PEPPER;
  if (!serverPepper) {
    console.error('VOTE_PEPPER not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // vote_hash = SHA256(account_id + poll_id + device_salt + server_pepper)
  // Server never stores device_salt, so this hash is not reconstructible server-side.
  const voteHash = createHash('sha256')
    .update(`${user.id}:${pollId}:${deviceSalt}:${serverPepper}`)
    .digest('hex');

  const { error: insertError } = await admin.from('poll_votes').insert({
    vote_hash: voteHash,
    poll_id: pollId,
    vote_choice: choice,
    verification_tag: account.verification_tag,
  });

  if (insertError) {
    // Primary key violation = already voted
    if (insertError.code === '23505') {
      return NextResponse.json({ error: 'You have already voted on this poll' }, { status: 409 });
    }
    console.error('Vote insert error:', insertError);
    return NextResponse.json({ error: 'Could not record vote' }, { status: 500 });
  }

  // Return fresh counts
  const { data: votes } = await admin
    .from('poll_votes')
    .select('vote_choice')
    .eq('poll_id', pollId);

  const counts = {};
  for (const v of votes ?? []) {
    counts[v.vote_choice] = (counts[v.vote_choice] ?? 0) + 1;
  }
  const total = votes?.length ?? 0;

  return NextResponse.json({ voted: choice, counts, total });
}
