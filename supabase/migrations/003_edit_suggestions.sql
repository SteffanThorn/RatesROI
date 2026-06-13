create table edit_suggestions (
  id uuid primary key default gen_random_uuid(),
  page_url text not null,
  page_title text,
  category text not null default 'other'
    check (category in ('factual_error', 'missing_info', 'bias_concern', 'outdated', 'other')),
  body text not null check (char_length(body) between 10 and 1000),
  contact_email text,
  status text not null default 'pending'
    check (status in ('pending', 'reviewed', 'applied', 'dismissed')),
  created_at timestamptz default now()
);

alter table edit_suggestions enable row level security;
-- Anyone can submit; only service role can read (for admin review)
create policy "Public insert" on edit_suggestions for insert with check (true);
