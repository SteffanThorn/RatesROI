import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getPollById } from '@/lib/polls';

export async function GET(request, { params }) {
  const { pollId } = await params;
  if (!getPollById(pollId)) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  const admin = await createAdminClient();

  const { data: votes, error } = await admin
    .from('poll_votes')
    .select('vote_choice')
    .eq('poll_id', pollId);

  if (error) {
    return NextResponse.json({ error: 'Could not fetch results' }, { status: 500 });
  }

  const counts = {};
  for (const v of votes ?? []) {
    counts[v.vote_choice] = (counts[v.vote_choice] ?? 0) + 1;
  }
  const total = votes?.length ?? 0;

  return NextResponse.json({ counts, total });
}
