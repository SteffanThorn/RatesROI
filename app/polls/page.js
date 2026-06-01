'use client';

import { useState, useEffect } from 'react';

const POLLS = [
  {
    id: 'party-vote-2026',
    type: 'election-vote',
    question: 'If the 2026 general election were held today, which party would you give your party vote to?',
    note: 'Anonymous · Your vote is not linked to your account',
    options: [
      { label: 'National', color: '#1a56a4' },
      { label: 'Labour', color: '#cc0000' },
      { label: 'ACT', color: '#f9c03a' },
      { label: 'Green', color: '#098137' },
      { label: 'NZ First', color: '#000000' },
      { label: 'Te Pāti Māori', color: '#b5281e' },
      { label: 'The Opportunities Party', color: '#5c40b5' },
      { label: 'Undecided / Other', color: '#6b7280' },
    ],
  },
  {
    id: 'top-issue-2026',
    type: 'general',
    question: 'What is the most important issue facing New Zealand right now?',
    note: 'Select one · Anonymous',
    options: [
      { label: 'Cost of living & inflation', color: '#f97316' },
      { label: 'Housing affordability', color: '#a855f7' },
      { label: 'Healthcare & hospital wait times', color: '#06b6d4' },
      { label: 'Climate change & environment', color: '#22c55e' },
      { label: 'Crime & public safety', color: '#ef4444' },
      { label: 'Education & child poverty', color: '#3b82f6' },
      { label: 'Treaty of Waitangi / Māori affairs', color: '#b5281e' },
      { label: 'Economic growth & jobs', color: '#f59e0b' },
    ],
  },
  {
    id: 'mp-representation',
    type: 'general',
    question: 'Do you feel adequately represented by your local MP?',
    note: 'Anonymous · Find your MP on the MPs page',
    options: [
      { label: 'Yes, very well', color: '#22c55e' },
      { label: 'Mostly yes', color: '#86efac' },
      { label: 'Neutral / not sure', color: '#94a3b8' },
      { label: 'Mostly no', color: '#fca5a5' },
      { label: 'No, not at all', color: '#ef4444' },
    ],
  },
  {
    id: 'mmp-threshold',
    type: 'general',
    question: 'Should the MMP 5% threshold be lowered to give smaller parties a better chance?',
    note: 'Anonymous · The current threshold has been debated since MMP was adopted',
    options: [
      { label: 'Yes — lower it to 3–4%', color: '#22c55e' },
      { label: 'Yes — abolish the threshold entirely', color: '#86efac' },
      { label: 'Keep it at 5%', color: '#94a3b8' },
      { label: 'Raise it above 5%', color: '#f97316' },
      { label: 'Not sure', color: '#6b7280' },
    ],
  },
];

function PollCard({ poll }) {
  const storageKey = `fairsaynz_poll_${poll.id}`;
  const [voted, setVoted] = useState(null);
  const [counts, setCounts] = useState(() => Object.fromEntries(poll.options.map((o) => [o.label, 0])));
  const [total, setTotal] = useState(0);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (stored) {
        setVoted(stored.voted);
        setCounts(stored.counts);
        setTotal(Object.values(stored.counts).reduce((a, b) => a + b, 0));
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  function handleVote(label) {
    if (voted) return;
    const newCounts = { ...counts, [label]: (counts[label] || 0) + 1 };
    const newTotal = total + 1;
    setVoted(label);
    setCounts(newCounts);
    setTotal(newTotal);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ voted: label, counts: newCounts }));
    } catch {
      // ignore
    }
  }

  function handleReset() {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    const zeroed = Object.fromEntries(poll.options.map((o) => [o.label, 0]));
    setVoted(null);
    setCounts(zeroed);
    setTotal(0);
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
                  className="w-full rounded-lg border border-white/10 px-4 py-2.5 text-left text-sm text-slate-200 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white"
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

      {voted ? (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            {total} vote{total !== 1 ? 's' : ''} recorded on this device
          </p>
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2"
          >
            Reset my vote
          </button>
        </div>
      ) : (
        <p className="mt-4 text-xs text-slate-500">Click an option to see the results.</p>
      )}
    </article>
  );
}

export default function PollsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">📊 Community Polls</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          Anonymous, NZ-focused civic polls. No sign-in required. Results are stored locally on your device —
          this is a community barometer, not an official survey.
        </p>
      </header>

      <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <p className="text-xs text-amber-200 leading-relaxed">
          <strong>About these polls:</strong> Results are stored in your browser only and reset if you clear your
          data. Fair Say NZ does not sell or share poll data. Polls are for community discussion — not a substitute
          for official polling or election results.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {POLLS.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>

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
