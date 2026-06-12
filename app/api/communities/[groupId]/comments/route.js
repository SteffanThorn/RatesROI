import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDataClient } from '@/lib/supabase/data';

export async function GET(request, { params }) {
  const { groupId } = await params;
  try {
    const supabase = getDataClient();
    const { data, error } = await supabase
      .from('community_comments')
      .select('id, body, created_at')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request, { params }) {
  const { groupId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body;
  try {
    const json = await request.json();
    body = json?.body?.trim();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body || body.length < 10 || body.length > 500) {
    return NextResponse.json({ error: 'Comment must be 10–500 characters' }, { status: 400 });
  }

  try {
    const supabase = getDataClient();

    // Confirm the group exists
    const { data: group, error: groupError } = await supabase
      .from('community_groups')
      .select('id')
      .eq('id', groupId)
      .single();
    if (groupError || !group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('community_comments')
      .insert({ group_id: groupId, user_id: session.user.id, body })
      .select('id, body, created_at')
      .single();
    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Comment insert error:', err);
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
  }
}
