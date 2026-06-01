import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AccountSettingsForm from '@/components/AccountSettingsForm';
import SignOutButton from '@/components/SignOutButton';

export const dynamic = 'force-dynamic';

const CIVIC_LINKS = [
  { href: '/news', icon: '📰', title: 'Grounded News', desc: 'Latest NZ politics' },
  { href: '/parties', icon: '🗳️', title: 'Parties', desc: 'Neutral party information' },
  { href: '/mps', icon: '🏛️', title: 'MPs', desc: 'Find & contact your MP' },
  { href: '/civics', icon: '📚', title: 'Civics', desc: 'How NZ government works' },
  { href: '/polls', icon: '📊', title: 'Polls', desc: 'Vote & pairwise rankings' },
  { href: '/events', icon: '📅', title: 'Civic Events', desc: 'Parliament & council news' },
  { href: '/newsletter', icon: '✉️', title: 'Newsletter', desc: 'Weekly Objective Truth' },
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
          <h1 className="mt-1 text-2xl font-bold text-white">My Account</h1>
          <p className="mt-1 text-sm text-slate-400">{session.user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <section className="card mb-6 rounded-2xl p-6">
        <h2 className="mb-4 font-semibold text-white">Profile</h2>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <span className="text-slate-400">Name</span>
            <p className="mt-0.5 font-medium text-white">{session.user.name}</p>
          </div>
          <div>
            <span className="text-slate-400">Role</span>
            <p className="mt-0.5 font-medium capitalize text-white">{session.user.role}</p>
          </div>
          <div>
            <span className="text-slate-400">Newsletter</span>
            <p className="mt-0.5 font-medium text-white">
              {session.user.newsletterSubscribed ? 'Subscribed' : 'Not subscribed'}
            </p>
          </div>
        </div>

        <AccountSettingsForm initialElectorate={session.user.preferredElectorate || ''} />
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

      {session.user.role === 'admin' ? (
        <section className="card mt-6 rounded-2xl border-amber-500/20 bg-amber-500/5 p-6">
          <h2 className="mb-3 font-semibold text-amber-300">🛡️ Admin Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500">
              Admin Dashboard →
            </Link>
            <Link href="/admin/events/new" className="rounded-lg border border-amber-500/30 px-4 py-2 text-sm text-amber-200 hover:bg-amber-500/10">
              Add Event
            </Link>
            <Link href="/admin/polls/new" className="rounded-lg border border-amber-500/30 px-4 py-2 text-sm text-amber-200 hover:bg-amber-500/10">
              Create Poll
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
