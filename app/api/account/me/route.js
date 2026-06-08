import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findById(session.user.id).select('isVerified verifiedType verifiedAt');
  if (!user) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  return NextResponse.json({
    isVerified: user.isVerified,
    verifiedType: user.verifiedType ?? null,
    verifiedAt: user.verifiedAt ?? null,
  });
}
