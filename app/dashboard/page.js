import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from '@/components/SignOutButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const CIVIC_LINKS = [
  { href: '/polls', icon: '📊', title: 'Polls', desc: 'Vote & see results' },
  { href: '/mps', icon: '🏛️', title: 'MPs', desc: 'Find & contact your MP' },
  { href: '/parties', icon: '🗳️', title: 'Parties', desc: 'Neutral party information' },
  { href: '/civics', icon: '📚', title: 'Civics', desc: 'How NZ government works' },
  { href: '/news', icon: '📰', title: 'News', desc: 'Latest NZ politics' },
  { href: '/events', icon: '📅', title: 'Events', desc: 'Parliament & council news' },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth');

  const { data: account } = await supabase
    .from('accounts')
    .select('verification_tag, is_verified, created_at')
    .eq('account_id', user.id)
    .maybeSingle();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
          <h1 className="mt-1 text-2xl font-bold text-white">My Account</h1>
        </div>
        <SignOutButton />
      </div>

      <section className="card mb-6 rounded-2xl p-6">
        <h2 className="mb-4 font-semibold text-white">Account</h2>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <span className="text-slate-400">Account ID</span>
            <p className="mt-0.5 font-mono text-xs text-slate-300 break-all">{user.id}</p>
          </div>
          <div>
            <span className="text-slate-400">Verification</span>
            <p className="mt-0.5 font-medium text-white">
              {account?.is_verified ? (
                <span className="text-emerald-300">
                  Verified · <code className="text-xs">{account.verification_tag}</code>
                </span>
              ) : (
                <span className="text-amber-300">Pending</span>
              )}
            </p>
          </div>
          <div>
            <span className="text-slate-400">Member since</span>
            <p className="mt-0.5 font-medium text-white">
              {account?.created_at ?? '—'}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-white">Explore Fair Say NZ</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CIVIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="card group rounded-xl p-4 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5"
            >
              <span className="mb-1 block text-2xl">{link.icon}</span>
              <p className="text-sm font-medium text-white group-hover:text-emerald-300">{link.title}</p>
              <p className="mt-0.5 text-xs text-slate-400">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
