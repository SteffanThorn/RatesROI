-- ============================================================
-- Fair Say NZ — initial schema
-- Privacy architecture: verified_identifiers and accounts are
-- intentionally unlinked. poll_votes has no account reference.
-- ============================================================

-- verified_identifiers
-- Exists solely to reject duplicate signups.
-- NO foreign key to accounts — by design.
-- Contains only a one-way hash of the identifier, never the raw value.
CREATE TABLE IF NOT EXISTS verified_identifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier_hash TEXT UNIQUE NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('phone_nz', 'email', 'web3_wallet', 'human_passport')),
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- accounts
-- The anonymous identity used throughout the app.
-- account_id = the Supabase auth user UUID (which itself has no PII after anonymisation).
-- verification_tag records HOW, never WHO.
CREATE TABLE IF NOT EXISTS accounts (
  account_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  verification_tag TEXT NOT NULL CHECK (
    verification_tag IN ('phone_nz', 'email', 'web3_wallet', 'human_passport')
  ),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  encrypted_salt_backup TEXT,
  -- Hashed device fingerprint (FingerprintJS visitorId) — used to detect duplicate signups
  -- from the same device. Nullable: not all clients support fingerprinting.
  device_hash TEXT,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS accounts_device_hash_idx ON accounts(device_hash)
  WHERE device_hash IS NOT NULL;

-- poll_votes
-- No account_id. No timestamps. No IP.
-- vote_hash = SHA256(account_id + poll_id + device_salt + server_pepper)
-- Server never has device_salt so it cannot reconstruct any vote hash.
CREATE TABLE IF NOT EXISTS poll_votes (
  vote_hash TEXT NOT NULL,
  poll_id TEXT NOT NULL,
  vote_choice TEXT NOT NULL,
  verification_tag TEXT NOT NULL CHECK (
    verification_tag IN ('phone_nz', 'email', 'web3_wallet', 'human_passport')
  ),
  PRIMARY KEY (vote_hash, poll_id)
);

-- poll_results
-- Survives after poll_votes is purged on poll close.
-- by_tag breakdown omits tags with fewer than 10 votes (rolled into "other").
CREATE TABLE IF NOT EXISTS poll_results (
  poll_id TEXT PRIMARY KEY,
  closed_at DATE NOT NULL,
  total_votes INTEGER NOT NULL,
  results_json JSONB NOT NULL
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE verified_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_results ENABLE ROW LEVEL SECURITY;

-- verified_identifiers: service role only (no user can read or write directly)
-- No RLS policies added — defaults to deny all. Service role bypasses RLS.

-- accounts: users can read their own record only
CREATE POLICY "users_read_own_account" ON accounts
  FOR SELECT USING (auth.uid() = account_id);

-- accounts: only service role can insert/update (via API routes)
-- No INSERT/UPDATE policies — handled server-side with service role key.

-- poll_votes: no user can read individual votes — ever
-- No SELECT policy. Service role aggregates for results.

-- poll_votes: authenticated verified users can insert
CREATE POLICY "verified_users_can_vote" ON poll_votes
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM accounts
      WHERE account_id = auth.uid()
      AND is_verified = TRUE
    )
  );

-- poll_results: public read
CREATE POLICY "public_read_results" ON poll_results
  FOR SELECT USING (true);
