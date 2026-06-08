-- ============================================================
-- Fair Say NZ — content tables (MPs, parties, news articles)
-- ============================================================

-- parties
CREATE TABLE IF NOT EXISTS parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  spectrum TEXT,
  founded_year INTEGER,
  current_leader TEXT,
  current_seats INTEGER DEFAULT 0,
  government_status TEXT,
  core_values TEXT[] DEFAULT '{}',
  history TEXT DEFAULT '',
  controversies TEXT[] DEFAULT '{}',
  ideology_description TEXT DEFAULT '',
  website TEXT,
  logo_url TEXT,
  color TEXT DEFAULT '#6b7280',
  is_parliamentary BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS parties_slug_idx ON parties(slug);

-- mps
CREATE TABLE IF NOT EXISTS mps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  full_name TEXT,
  slug TEXT NOT NULL UNIQUE,
  party_id UUID REFERENCES parties(id),
  party_name TEXT NOT NULL,
  role TEXT DEFAULT 'MP',
  type TEXT DEFAULT 'electorate' CHECK (type IN ('electorate', 'list')),
  electorate TEXT,
  political_spectrum TEXT,
  career_before_politics TEXT[] DEFAULT '{}',
  career_in_politics TEXT[] DEFAULT '{}',
  key_positions TEXT[] DEFAULT '{}',
  accomplishments TEXT[] DEFAULT '{}',
  controversies TEXT[] DEFAULT '{}',
  bio_summary TEXT DEFAULT '',
  contact_email TEXT,
  photo_url TEXT,
  parliament_page_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS mps_slug_idx ON mps(slug);
CREATE INDEX IF NOT EXISTS mps_party_id_idx ON mps(party_id);
CREATE INDEX IF NOT EXISTS mps_is_active_idx ON mps(is_active);

-- news_articles
-- Note: MongoDB had a TTL index that auto-deleted articles > 7 days old.
-- In Supabase use pg_cron or a scheduled Edge Function to replicate this:
--   DELETE FROM news_articles WHERE published_date < NOW() - INTERVAL '7 days';
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT,
  url TEXT NOT NULL UNIQUE,
  summary TEXT DEFAULT '',
  published_date TIMESTAMPTZ NOT NULL,
  category TEXT DEFAULT 'politics' CHECK (
    category IN ('national', 'local', 'politics', 'economy', 'environment')
  ),
  image_url TEXT,
  api_source_id TEXT UNIQUE,
  feed_source TEXT DEFAULT 'newsapi',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS news_articles_published_date_idx ON news_articles(published_date DESC);
CREATE INDEX IF NOT EXISTS news_articles_category_idx ON news_articles(category, published_date DESC);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE mps ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- All content tables are publicly readable
CREATE POLICY "public_read_parties" ON parties FOR SELECT USING (true);
CREATE POLICY "public_read_mps" ON mps FOR SELECT USING (true);
CREATE POLICY "public_read_news_articles" ON news_articles FOR SELECT USING (true);

-- Writes are service-role only (no INSERT/UPDATE/DELETE policies needed —
-- service role bypasses RLS automatically)
