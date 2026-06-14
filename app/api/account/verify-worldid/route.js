import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in first' }, { status: 401 });
  }

  const secret = process.env.IDENTITY_SECRET;
  const appId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID;
  const action = process.env.WORLDCOIN_ACTION ?? 'verify-voter';

  if (!secret || !appId) {
    console.error('Missing env vars: IDENTITY_SECRET or NEXT_PUBLIC_WORLDCOIN_APP_ID');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { proof, nullifier_hash, merkle_root, verification_level } = body ?? {};
  if (!proof || !nullifier_hash || !merkle_root) {
    return NextResponse.json({ error: 'Missing proof fields' }, { status: 400 });
  }

  // Verify the ZK proof with World ID's cloud API
  try {
    const res = await fetch(`https://developer.worldcoin.org/api/v2/verify/${appId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proof, nullifier_hash, merkle_root, verification_level, action, signal: '' }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return NextResponse.json(
        { error: data.detail ?? 'World ID verification failed — please try again' },
        { status: 422 }
      );
    }
  } catch (err) {
    console.error('[verify-worldid] World ID API error:', err.message);
    return NextResponse.json({ error: 'Could not reach World ID — please try again' }, { status: 502 });
  }

  // nullifier_hash is a unique ZK identifier per human per action — use it as our identity anchor
  const identityHash = createHmac('sha256', secret)
    .update(`world_id:${nullifier_hash}`)
    .digest('hex');

  await dbConnect();
  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  if (user.isVerified) return NextResponse.json({ error: 'Already verified' }, { status: 409 });

  const existing = await User.findOne({ identityHash });
  if (existing) {
    return NextResponse.json(
      { error: 'This World ID is already linked to another account.' },
      { status: 409 }
    );
  }

  user.isVerified = true;
  user.verifiedType = 'world_id';
  user.verifiedAt = new Date();
  user.identityHash = identityHash;
  await user.save();

  return NextResponse.json({ message: 'Verified via World ID', verifiedType: 'world_id' });
}
