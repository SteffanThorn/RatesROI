import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  let db = 'disconnected';
  try {
    await dbConnect();
    db = 'connected';
  } catch {
    db = 'error';
  }
  return NextResponse.json({ ok: db === 'connected', service: 'fairsaynz', ts: new Date().toISOString(), db });
}
