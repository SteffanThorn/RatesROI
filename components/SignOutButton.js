'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth');
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5"
    >
      Sign out
    </button>
  );
}
