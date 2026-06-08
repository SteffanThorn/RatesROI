import { createClient } from '@supabase/supabase-js';

let _client;

// Service-role client for server-side content reads/writes.
// No cookie handling — never use in auth flows.
export function getDataClient() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return _client;
}
