import { NextResponse } from 'next/server';
import { getDataClient } from '@/lib/supabase/data';

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { page_url, page_title, category, body, contact_email } = payload ?? {};
  const text = body?.trim();

  if (!text || text.length < 10 || text.length > 1000) {
    return NextResponse.json({ error: 'Suggestion must be 10–1000 characters' }, { status: 400 });
  }

  const validCategories = ['factual_error', 'missing_info', 'bias_concern', 'outdated', 'other'];

  try {
    const supabase = getDataClient();
    const { error } = await supabase.from('edit_suggestions').insert({
      page_url:      (page_url  || 'unknown').slice(0, 500),
      page_title:    (page_title || null)?.slice(0, 200),
      category:      validCategories.includes(category) ? category : 'other',
      body:          text,
      contact_email: contact_email?.trim() || null,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/suggestions]', err);
    return NextResponse.json({ error: 'Failed to save suggestion' }, { status: 500 });
  }
}
