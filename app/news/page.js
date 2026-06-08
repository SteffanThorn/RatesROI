import { Suspense } from 'react';
import { getNZNews } from '@/lib/newsCache';

export const metadata = {
  title: 'Grounded News',
  description: 'NZ politics news aggregated from multiple sources. Neutral summaries, no spin.',
};

// Revalidate every 10 minutes on Vercel ISR
export const revalidate = 600;

const CATEGORY_BADGE = {
  politics:    { label: 'Politics',    cls: 'badge-blue'  },
  national:    { label: 'National',    cls: 'badge-green' },
  local:       { label: 'Local',       cls: 'badge-amber' },
  economy:     { label: 'Economy',     cls: 'badge-amber' },
  environment: { label: 'Environment', cls: 'badge-green' },
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function ArticleCard({ article }) {
  const badge = CATEGORY_BADGE[article.category] || CATEGORY_BADGE.politics;
  return (
    <article className="card rounded-2xl overflow-hidden flex flex-col hover:border-white/20 transition-colors">
      {article.imageUrl && (
        <div className="h-44 overflow-hidden bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt=""
            className="h-full w-full object-cover opacity-90"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`badge ${badge.cls}`}>{badge.label}</span>
          <span className="text-xs text-slate-400">{article.source}</span>
          <span className="text-xs text-slate-500 ml-auto">{timeAgo(article.publishedDate)}</span>
        </div>

        <h2 className="text-base font-semibold leading-snug text-white mb-2 line-clamp-3">
          {article.title}
        </h2>

        {article.summary && (
          <p className="text-sm text-slate-300 line-clamp-3 flex-1">{article.summary}</p>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          Read full article
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </article>
  );
}

function ArticleSkeleton() {
  return (
    <div className="card rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-700/40" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-4 w-16 rounded-full bg-slate-700/60" />
          <div className="h-4 w-20 rounded-full bg-slate-700/40" />
        </div>
        <div className="h-5 w-full rounded bg-slate-700/60" />
        <div className="h-5 w-4/5 rounded bg-slate-700/50" />
        <div className="h-4 w-full rounded bg-slate-700/40" />
        <div className="h-4 w-3/4 rounded bg-slate-700/30" />
      </div>
    </div>
  );
}

async function NewsFeed() {
  let articles = [];
  try {
    articles = await getNZNews({ limit: 24 });
  } catch {
    return (
      <div className="card rounded-2xl p-8 text-center">
        <p className="text-2xl mb-2">🔌</p>
        <p className="font-semibold text-white">Database not connected</p>
        <p className="mt-1 text-sm text-slate-400">
          Check your Supabase credentials in <code className="text-emerald-400">.env.local</code> to enable the news feed.
        </p>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="card rounded-2xl p-8 text-center">
        <p className="text-2xl mb-2">📡</p>
        <p className="font-semibold text-white">No articles cached yet</p>
        <p className="mt-1 text-sm text-slate-400">
          Add <code className="text-emerald-400">NEWS_API_KEY</code> to your .env and the feed will populate automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard key={a._id?.toString() || a.url} article={a} />
      ))}
    </div>
  );
}

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400 mb-1">Fair Say NZ</p>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              📰 Grounded News
            </h1>
            <p className="mt-2 max-w-xl text-slate-300 text-sm leading-relaxed">
              NZ politics and government news from multiple sources — no spin, no filter bubble.
              Always read the original article and check multiple sources before forming an opinion.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <p className="text-xs text-amber-200 leading-relaxed">
            <strong>ℹ️ About these articles:</strong> Fair Say NZ aggregates headlines from independent NZ news sources.
            We do not write, edit, or endorse any article. We do not affiliate with any political party.
            Source attribution is shown on every card.
          </p>
        </div>
      </header>

      {/* Feed */}
      <Suspense
        fallback={
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        }
      >
        <NewsFeed />
      </Suspense>
    </main>
  );
}
