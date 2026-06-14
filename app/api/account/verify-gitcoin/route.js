import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

const SCORE_THRESHOLD = 1; // Any stamps at all; raise to 20+ for stricter gating

function isValidEthAddress(addr) {
  return /^0x[0-9a-fA-F]{40}$/.test(addr);
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in first' }, { status: 401 });
  }

  const secret = process.env.IDENTITY_SECRET;
  const apiKey = process.env.GITCOIN_SCORER_API_KEY;
  const scorerId = process.env.GITCOIN_SCORER_ID;

  if (!secret || !apiKey || !scorerId) {
    console.error('Missing env vars: IDENTITY_SECRET, GITCOIN_SCORER_API_KEY or GITCOIN_SCORER_ID');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const address = body?.address?.trim().toLowerCase();
  if (!address || !isValidEthAddress(address)) {
    return NextResponse.json({ error: 'A valid Ethereum wallet address is required' }, { status: 400 });
  }

  // Fetch score from Gitcoin Passport Scorer API
  let score;
  try {
    const res = await fetch(
      `https://api.scorer.gitcoin.co/registry/score/${scorerId}/${address}`,
      { headers: { 'X-API-KEY': apiKey }, next: { revalidate: 0 } }
    );
    if (res.status === 404) {
      return NextResponse.json(
        { error: 'No Gitcoin Passport found for this address. Visit passport.xyz to create one first.' },
        { status: 422 }
      );
    }
    if (!res.ok) {
      throw new Error(`Scorer API ${res.status}`);
    }
    const data = await res.json();
    score = parseFloat(data.score ?? '0');
  } catch (err) {
    console.error('[verify-gitcoin] Scorer API error:', err.message);
    return NextResponse.json({ error: 'Could not reach Gitcoin Passport — please try again' }, { status: 502 });
  }

  if (score < SCORE_THRESHOLD) {
    return NextResponse.json(
      { error: `Your Passport score is ${score.toFixed(2)} — a minimum of ${SCORE_THRESHOLD} is required. Add more stamps at passport.xyz.` },
      { status: 422 }
    );
  }

  // HMAC the wallet address so the raw address is never stored
  const identityHash = createHmac('sha256', secret)
    .update(`gitcoin:${address}`)
    .digest('hex');

  await dbConnect();
  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  if (user.isVerified) return NextResponse.json({ error: 'Already verified' }, { status: 409 });

  const existing = await User.findOne({ identityHash });
  if (existing) {
    return NextResponse.json(
      { error: 'This wallet is already linked to another account.' },
      { status: 409 }
    );
  }

  user.isVerified = true;
  user.verifiedType = 'gitcoin_passport';
  user.verifiedAt = new Date();
  user.identityHash = identityHash;
  await user.save();

  return NextResponse.json({ message: 'Verified via Gitcoin Passport', verifiedType: 'gitcoin_passport' });
}
