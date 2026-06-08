import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

const VALID_TYPES = ['ird', 'ratespayer'];

function normalizeNumber(type, raw) {
  if (type === 'ird') {
    // IRD numbers are 8–9 digits; strip everything except digits
    return raw.replace(/\D/g, '');
  }
  // Ratespayer numbers: strip whitespace/dashes, uppercase
  return raw.replace(/[\s\-]/g, '').toUpperCase();
}

function validateIrd(digits) {
  if (digits.length < 8 || digits.length > 9) return false;
  // Pad to 9 digits
  const padded = digits.padStart(9, '0');
  const weights = [3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(padded[i], 10) * weights[i];
  }
  let remainder = sum % 11;
  let checkDigit;
  if (remainder === 0) {
    checkDigit = 0;
  } else if (remainder === 1) {
    // Try secondary weights
    const weights2 = [7, 4, 3, 7, 5, 2, 7, 6];
    sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += parseInt(padded[i], 10) * weights2[i];
    }
    remainder = sum % 11;
    if (remainder === 1) return false;
    checkDigit = remainder === 0 ? 0 : 11 - remainder;
  } else {
    checkDigit = 11 - remainder;
  }
  return parseInt(padded[8], 10) === checkDigit;
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to verify your identity' }, { status: 401 });
  }

  const secret = process.env.IDENTITY_SECRET;
  if (!secret) {
    console.error('IDENTITY_SECRET env var is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { type, number } = body;

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'type must be "ird" or "ratespayer"' }, { status: 400 });
  }

  if (!number || typeof number !== 'string' || number.trim().length === 0) {
    return NextResponse.json({ error: 'Number is required' }, { status: 400 });
  }

  const normalized = normalizeNumber(type, number.trim());

  if (type === 'ird') {
    if (!validateIrd(normalized)) {
      return NextResponse.json({ error: 'That IRD number does not appear to be valid. Please check and try again.' }, { status: 422 });
    }
  } else {
    if (normalized.length < 4 || normalized.length > 20) {
      return NextResponse.json({ error: 'Ratespayer number must be 4–20 characters' }, { status: 422 });
    }
  }

  // HMAC with type prefix to prevent cross-type collisions
  const identityHash = createHmac('sha256', secret)
    .update(`${type}:${normalized}`)
    .digest('hex');

  await dbConnect();

  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  if (user.isVerified) {
    return NextResponse.json({ error: 'Your account is already verified' }, { status: 409 });
  }

  // Check if this identity is already claimed by another account
  const existing = await User.findOne({ identityHash });
  if (existing) {
    return NextResponse.json(
      { error: 'This number is already linked to another account. Each number may only be used once.' },
      { status: 409 }
    );
  }

  user.isVerified = true;
  user.verifiedType = type;
  user.verifiedAt = new Date();
  user.identityHash = identityHash;
  await user.save();

  return NextResponse.json({ message: 'Identity verified successfully', verifiedType: type });
}
