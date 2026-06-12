-- Community groups (admin-seeded)
create table community_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  platform text not null default 'facebook' check (platform in ('facebook', 'whatsapp', 'telegram', 'reddit', 'other')),
  url text,
  member_count_approx int,
  lean text check (lean in ('left', 'centre-left', 'centre', 'centre-right', 'right', 'mixed')),
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- User experience comments
-- user_id stores the NextAuth user ID (MongoDB ObjectId as string) — NOT a Supabase auth UUID.
-- Writes go through API routes using the service role key; RLS only gates direct client access.
create table community_comments (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references community_groups(id) on delete cascade,
  user_id text not null,
  body text not null check (char_length(body) between 10 and 500),
  created_at timestamptz default now()
);

-- RLS
alter table community_groups enable row level security;
create policy "Public read" on community_groups for select using (true);

alter table community_comments enable row level security;
create policy "Public read" on community_comments for select using (true);
-- Insert/delete handled server-side via service role key (bypasses RLS).

-- ── Seed data ─────────────────────────────────────────────────────────────────
insert into community_groups (name, description, platform, url, member_count_approx, lean, is_verified) values
  (
    'NZ Politics',
    'One of New Zealand''s largest open political discussion groups. Wide-ranging debate across the spectrum — from parliament to local council. All viewpoints present.',
    'facebook',
    'https://www.facebook.com/groups/NZPolitics',
    45000, 'mixed', true
  ),
  (
    'New Zealand Labour Party',
    'The official Facebook page of the NZ Labour Party. Centre-left content on social equality, workers'' rights, public health, and climate policy.',
    'facebook',
    'https://www.facebook.com/NZLabour',
    48000, 'left', true
  ),
  (
    'New Zealand National Party',
    'The official page of the NZ National Party. Centre-right content focused on economic growth, fiscal responsibility, and law and order.',
    'facebook',
    'https://www.facebook.com/NZNationalParty',
    62000, 'right', true
  ),
  (
    'ACT New Zealand',
    'Official page of ACT NZ. Libertarian-right perspectives on small government, individual freedom, deregulation, and free-market economics.',
    'facebook',
    'https://www.facebook.com/ACTNewZealand',
    32000, 'right', true
  ),
  (
    'Green Party of Aotearoa New Zealand',
    'Official page of the Green Party. Progressive-left content covering climate action, social justice, housing, and te Tiriti o Waitangi.',
    'facebook',
    'https://www.facebook.com/GreenPartyNZ',
    41000, 'left', true
  ),
  (
    'NZ First',
    'Official page of New Zealand First. Populist and nationalist content on NZ sovereignty, controlled immigration, superannuation, and NZ-owned assets.',
    'facebook',
    'https://www.facebook.com/NZFirstOfficial',
    18000, 'centre-right', true
  ),
  (
    'Te Pāti Māori',
    'Official page of Te Pāti Māori. Māori self-determination, te Tiriti o Waitangi, te reo Māori, and progressive economic justice.',
    'facebook',
    'https://www.facebook.com/TePartiMaori',
    28000, 'left', true
  ),
  (
    'NZ Political Discussion',
    'An open community for New Zealanders to discuss politics, policy, and current events without party affiliation. All viewpoints welcome.',
    'facebook',
    'https://www.facebook.com/groups/nzpoliticaldiscussion',
    22000, 'mixed', false
  ),
  (
    'Fair Say NZ',
    'The official community for Fair Say NZ — a neutral civic platform built to give every New Zealander a fair say. Share ideas, give feedback, and connect with others who want better civic engagement.',
    'facebook',
    'https://www.facebook.com/groups/fairsaynz',
    500, 'mixed', true
  );
