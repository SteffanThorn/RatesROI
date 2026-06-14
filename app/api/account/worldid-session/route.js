import { createSign, randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in first' }, { status: 401 });
  }

  const rpId = process.env.WORLDCOIN_RP_ID;
  const rpPrivateKeyPem = process.env.WORLDCOIN_RP_PRIVATE_KEY;

  if (!rpId || !rpPrivateKeyPem) {
    return NextResponse.json({ error: 'World ID is not yet configured on this server.' }, { status: 503 });
  }

  const nonce = randomBytes(16).toString('hex');
  const created_at = Math.floor(Date.now() / 1000);
  const expires_at = created_at + 300;

  // P-256 ECDSA signature over the serialised payload, as required by World ID's RP protocol
  const payload = JSON.stringify({ nonce, created_at });
  const sign = createSign('SHA256');
  sign.update(payload);
  sign.end();
  const signature = sign.sign(rpPrivateKeyPem, 'base64');

  return NextResponse.json({ rp_id: rpId, nonce, created_at, expires_at, signature });
}
