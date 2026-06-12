import Link from 'next/link';
import { Suspense } from 'react';
import { getNZNews } from '@/lib/newsCache';

export const metadata = {
  title: 'Fair Say NZ — Everyone gets a fair say.',
};

export const revalidate = 600;

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

async function LatestNews() {
  let articles = [];
  try {
    articles = await getNZNews({ limit: 5 });
  } catch {
    // fail silently — show empty state
  }

  if (!articles.length) {
    return (
      <p className="text-sm text-slate-400 py-4">
        Add <code className="text-emerald-400">NEWS_API_KEY</code> to .env to enable the news feed.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-white/8">
      {articles.map((a) => (
        <li key={a._id?.toString() || a.url} className="py-3">
          <a
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <p className="text-sm font-medium text-white group-hover:text-emerald-300 line-clamp-2 leading-snug">
              {a.title}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {a.source} · {timeAgo(a.publishedDate)}
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}

const QUICK_LINKS = [
  { href: '/parties',      icon: '🗳️',  title: 'Parties',      desc: 'Neutral party comparisons'     },
  { href: '/mps',          icon: '🏛️', title: 'MPs',           desc: 'Find & contact your MP'        },
  { href: '/civics',       icon: '📚',  title: 'Civics',        desc: 'How NZ government works'       },
  { href: '/polls',        icon: '📊',  title: 'Polls',         desc: 'Have your anonymous say'       },
  { href: '/communities',  icon: '👥',  title: 'Communities',   desc: 'Find groups across the spectrum' },
  { href: '/events',       icon: '📅',  title: 'Events',        desc: 'Parliament & council news'     },
  { href: '/newsletter',   icon: '✉️',  title: 'Newsletter',    desc: 'Weekly "Objective Truth"'      },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <section className="card mb-8 rounded-3xl p-7 sm:p-10">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
          Everyone gets<br className="hidden sm:block" /> a fair say.
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-300">
          Education + real ways to have your say. 100% neutral, NZ-focused, neutral sources only.
          No party affiliation. No spin.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/news" className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-500">
            Grounded News →
          </Link>
          <Link href="/civics" className="rounded-lg border border-white/15 px-5 py-2.5 font-medium hover:bg-white/5">
            How NZ Government Works
          </Link>
          <Link href="/newsletter" className="rounded-lg border border-emerald-500/30 px-5 py-2.5 font-medium text-emerald-200 hover:bg-emerald-500/10">
            Subscribe to newsletter
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">📰 Latest NZ News</h2>
            <Link href="/news" className="text-xs text-emerald-400 hover:underline">
              See all →
            </Link>
          </div>
          <Suspense fallback={<div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded bg-slate-700/40" />)}</div>}>
            <LatestNews />
          </Suspense>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">🧭 Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="card group rounded-xl p-4 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5"
              >
                <span className="mb-1 block text-2xl">{link.icon}</span>
                <p className="text-sm font-medium text-white group-hover:text-emerald-300">{link.title}</p>
                <p className="mt-0.5 text-xs leading-tight text-slate-400">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-5">
        <h3 className="mb-2 text-sm font-semibold text-white">Our pledge to you</h3>
        <ul className="grid gap-3 text-xs leading-relaxed text-slate-300 sm:grid-cols-3">
          <li className="flex gap-2"><span className="mt-0.5 text-emerald-400">✓</span> <span>We never endorse a party, candidate, or ideology.</span></li>
          <li className="flex gap-2"><span className="mt-0.5 text-emerald-400">✓</span> <span>Every claim is sourced. Multiple sources always shown.</span></li>
          <li className="flex gap-2"><span className="mt-0.5 text-emerald-400">✓</span> <span>Poll results are anonymous and community-wide aggregates only.</span></li>
        </ul>
      </section>
    </main>
  );
}
