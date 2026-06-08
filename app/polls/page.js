'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { POLLS } from '@/lib/polls';

function PollCard({ poll, isVerified }) {
  const [voted, setVoted] = useState(null);
  const [counts, setCounts] = useState(() => Object.fromEntries(poll.options.map((o) => [o.label, 0])));
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/polls/${poll.id}/results`);
        if (!res.ok) return;
        const data = await res.json();
        setCounts(data.counts ?? {});
        setTotal(data.total ?? 0);
        // Check if user already voted (no server-side "did I vote" endpoint yet;
        // we persist voted choice in sessionStorage keyed by poll id)
        const stored = sessionStorage.getItem(`fairsaynz_voted_${poll.id}`);
        if (stored) setVoted(stored);
      } catch {
        // silent — show zeroed counts
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [poll.id]);

  async function handleVote(label) {
    if (voted || voting || !isVerified) return;
    setVoting(true);
    setError('');
    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: label }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Vote failed');
        return;
      }
      setVoted(label);
      setCounts(data.counts ?? {});
      setTotal(data.total ?? 0);
      sessionStorage.setItem(`fairsaynz_voted_${poll.id}`, label);
    } catch {
      setError('Network error — please try again');
    } finally {
      setVoting(false);
    }
  }

  const TYPE_BADGE = {
    'election-vote': { label: 'Election Poll', cls: 'bg-blue-500/15 text-blue-300' },
    general: { label: 'Community Poll', cls: 'bg-emerald-500/15 text-emerald-300' },
  };
  const badge = TYPE_BADGE[poll.type] || TYPE_BADGE.general;

  return (
    <article className="card rounded-2xl p-5 sm:p-6">
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>{badge.label}</span>
          <span className="text-xs text-slate-400">{poll.note}</span>
        </div>
        <h2 className="text-base font-semibold leading-snug text-white">{poll.question}</h2>
      </div>

      {loading ? (
        <div className="space-y-2">
          {poll.options.map((o) => (
            <div key={o.label} className="h-10 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {poll.options.map((option) => {
            const count = counts[option.label] || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isChosen = voted === option.label;

            return (
              <div key={option.label}>
                {!voted ? (
                  <button
                    onClick={() => handleVote(option.label)}
                    disabled={voting}
                    className="w-full rounded-lg border border-white/10 px-4 py-2.5 text-left text-sm text-slate-200 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white disabled:opacity-50"
                  >
                    {option.label}
                  </button>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border border-white/8">
                    <div
                      className="absolute inset-y-0 left-0 transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: option.color, opacity: 0.18 }}
                    />
                    <div className="relative flex items-center justify-between px-4 py-2.5">
                      <span className={`text-sm ${isChosen ? 'font-semibold text-white' : 'text-slate-300'}`}>
                        {isChosen && <span className="mr-1.5">✓</span>}
                        {option.label}
                      </span>
                      <span className="text-xs font-medium text-slate-400 tabular-nums">{pct}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {error ? <p className="mt-3 text-xs text-red-400">{error}</p> : null}

      {voted ? (
        <p className="mt-4 text-xs text-slate-400">
          {total} verified vote{total !== 1 ? 's' : ''} cast
        </p>
      ) : (
        <p className="mt-4 text-xs text-slate-500">
          {loading ? '' : 'Click an option to see the results.'}
        </p>
      )}
    </article>
  );
}

export default function PollsPage() {
  const { status } = useSession();
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/account/me')
      .then((r) => r.json())
      .then((d) => setVerificationStatus(d))
      .catch(() => setVerificationStatus({ isVerified: false }));
  }, [status]);

  const isLoadingSession = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const isVerified = verificationStatus?.isVerified ?? false;
  const isLoadingVerification = isAuthenticated && verificationStatus === null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Community Polls</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          Sybil-resistant civic polls. One vote per verified NZ taxpayer or ratepayer. Results reflect
          the community — not bots or duplicate accounts.
        </p>
      </header>

      {/* Privacy note */}
      <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
        <p className="text-xs text-blue-200 leading-relaxed">
          <strong>Privacy:</strong> Your IRD or ratespayer number is hashed with a one-way function before
          any data is saved. The original number never leaves the server unencrypted and is never stored in
          our database. Votes cannot be linked back to you personally. For maximum privacy, consider using a{' '}
          <a href="https://proton.me/mail" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-100">
            ProtonMail address
          </a>{' '}
          when signing up.
        </p>
      </div>

      {isLoadingSession || isLoadingVerification ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {POLLS.map((poll) => (
            <div key={poll.id} className="card rounded-2xl p-5 space-y-3">
              <div className="h-4 w-32 rounded bg-white/5 animate-pulse" />
              <div className="h-6 w-3/4 rounded bg-white/5 animate-pulse" />
              {poll.options.map((o) => (
                <div key={o.label} className="h-10 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      ) : !isAuthenticated ? (
        <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-10 text-center">
          <p className="text-2xl mb-3">🔒</p>
          <h2 className="text-lg font-semibold text-white mb-2">Sign in to vote</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
            Create a free account and verify your identity to participate in Fair Say NZ polls.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/auth/signin" className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500">
              Sign in
            </Link>
            <Link href="/auth/signup" className="rounded-lg border border-white/15 px-5 py-2.5 text-sm text-slate-300 hover:bg-white/5">
              Create account
            </Link>
          </div>
        </div>
      ) : !isVerified ? (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-10 text-center">
          <p className="text-2xl mb-3">🪪</p>
          <h2 className="text-lg font-semibold text-white mb-2">Verify your identity to vote</h2>
          <p className="text-sm text-slate-400 mb-2 max-w-md mx-auto">
            To prevent multiple votes from the same person, we require a one-time identity check
            using your IRD number or ratespayer number.
          </p>
          <p className="text-xs text-slate-500 mb-6 max-w-md mx-auto">
            Your number is never stored — only a one-way cryptographic hash is saved.
          </p>
          <Link
            href="/dashboard"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Verify in Account Settings →
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
              Verified voter
            </span>
            <span className="text-xs text-slate-400">Your votes count once and cannot be traced back to you.</span>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {POLLS.map((poll) => (
              <PollCard key={poll.id} poll={poll} isVerified={isVerified} />
            ))}
          </div>
        </>
      )}

      <section className="mt-10 rounded-2xl border border-white/8 bg-white/3 px-6 py-5">
        <h3 className="mb-2 font-semibold text-white">Want to see your MP's voting record?</h3>
        <p className="text-sm text-slate-300 mb-3">
          Find every active MP, their party, electorate, and contact details.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/mps"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Browse all MPs →
          </a>
          <a
            href="/civics"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
          >
            How MMP works →
          </a>
        </div>
      </section>
    </main>
  );
}
