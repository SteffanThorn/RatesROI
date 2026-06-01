import Link from 'next/link';

export const metadata = {
  title: 'Events',
  description: 'Key NZ civic events, Parliament sitting dates, election countdown, and local government news.',
};

const EVENTS = [
  {
    date: '2026-10-17',
    title: '2026 NZ General Election',
    category: 'election',
    status: 'upcoming',
    source: 'Electoral Commission',
    sourceUrl: 'https://elections.nz',
    description:
      'New Zealanders will vote in the next general election. Date is indicative — the PM may call an early election. Party vote determines seat allocation under MMP. Enrol to vote by the close of rolls.',
    action: { label: 'Enrol to vote', url: 'https://www.elections.nz/enrol/' },
  },
  {
    date: '2026-07-01',
    title: 'Close of Rolls — 2026 Election',
    category: 'election',
    status: 'upcoming',
    source: 'Electoral Commission',
    description:
      'The electoral rolls close around 3 months before election day. Enrol early to ensure your vote counts. You can enrol online in minutes at elections.nz.',
    action: { label: 'Check enrolment', url: 'https://www.elections.nz/enrol/' },
  },
  {
    date: '2026-05-21',
    title: 'Budget 2026',
    category: 'budget',
    status: 'upcoming',
    source: 'Treasury / Parliament',
    sourceUrl: 'https://treasury.govt.nz',
    description:
      'The annual government budget sets spending priorities and tax policy for the coming year. The Minister of Finance presents the Budget to Parliament. Public debate and select committee scrutiny follows.',
    action: { label: 'Budget documents', url: 'https://treasury.govt.nz/publications/budgets' },
  },
  {
    date: '2025-10-11',
    title: '2025 Local Elections',
    category: 'election',
    status: 'past',
    source: 'Electoral Commission',
    description:
      'New Zealanders voted for local mayors, councillors, regional councillors, and community boards across the country. Results determined local leadership for the 2025–2028 term.',
  },
  {
    date: '2025-05-22',
    title: 'Budget 2025',
    category: 'budget',
    status: 'past',
    source: 'Treasury',
    description:
      "The government's 2025 budget outlined fiscal priorities including health, infrastructure, and cost-of-living measures. Delivered by Finance Minister Nicola Willis.",
    action: { label: 'View Budget 2025', url: 'https://treasury.govt.nz/publications/budgets/budget-2025' },
  },
  {
    date: '2025-02-06',
    title: 'Waitangi Day — Treaty Debates',
    category: 'other',
    status: 'past',
    source: 'Waitangi Tribunal',
    description:
      "Annual commemorations at Waitangi, with political leaders attending hui and addressing the nation. A focal point for debate on the Treaty of Waitangi principles and the relationship between the Crown and Māori.",
  },
];

const PARLIAMENT_SITTINGS = [
  { period: 'Feb – Apr 2026', note: 'First sitting block of 2026' },
  { period: 'May 2026', note: 'Budget week' },
  { period: 'Jun – Aug 2026', note: 'Pre-election sitting period' },
  { period: 'Sep 2026', note: 'Parliament likely dissolved for election campaign' },
];

const CATEGORY_STYLES = {
  election: { cls: 'bg-blue-500/15 text-blue-300 border-blue-500/30', label: 'Election' },
  budget: { cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30', label: 'Budget' },
  parliament: { cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', label: 'Parliament' },
  council: { cls: 'bg-purple-500/15 text-purple-300 border-purple-500/30', label: 'Council' },
  other: { cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30', label: 'Other' },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Pacific/Auckland',
  });
}

function ElectionCountdown() {
  const electionDate = new Date('2026-10-17T00:00:00+13:00');
  const now = new Date('2026-06-01');
  const diffMs = electionDate - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const remainingDays = diffDays % 7;

  return (
    <section className="mb-8 rounded-2xl border border-blue-500/25 bg-blue-500/8 px-6 py-6">
      <p className="text-xs uppercase tracking-widest text-blue-400 mb-1">2026 General Election</p>
      <h2 className="text-2xl font-bold text-white">
        ~{diffWeeks} weeks, {remainingDays} days to go
      </h2>
      <p className="mt-1 text-sm text-slate-300">
        Indicative date: 17 October 2026 · The PM can call an earlier election.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href="https://www.elections.nz/enrol/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Enrol to vote ↗
        </a>
        <Link
          href="/parties"
          className="rounded-lg border border-blue-500/30 px-4 py-2 text-sm text-blue-200 hover:bg-blue-500/10"
        >
          Compare parties →
        </Link>
      </div>
    </section>
  );
}

export default function EventsPage() {
  const upcoming = EVENTS.filter((e) => e.status === 'upcoming').sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const past = EVENTS.filter((e) => e.status === 'past').sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">📅 Civic Events</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          Key dates in New Zealand civic and political life — elections, budgets, and parliament sitting dates.
          All sources linked.
        </p>
      </header>

      <ElectionCountdown />

      {/* Upcoming events */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-white">Upcoming</h2>
        <div className="space-y-4">
          {upcoming.map((event) => {
            const cat = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.other;
            return (
              <article key={event.title} className="card rounded-2xl p-5">
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${cat.cls}`}>
                        {cat.label}
                      </span>
                      <span className="text-xs text-slate-400">{formatDate(event.date)}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white">{event.title}</h3>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{event.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  {event.action && (
                    <a
                      href={event.action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
                    >
                      {event.action.label} ↗
                    </a>
                  )}
                  {event.sourceUrl ? (
                    <a
                      href={event.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-slate-400"
                    >
                      Source: {event.source} ↗
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500">Source: {event.source}</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Parliament sitting schedule */}
      <section className="mb-10 card rounded-2xl p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">🏛️ 2026 Parliament Sitting Schedule</h2>
        <p className="mb-4 text-sm text-slate-400">
          Parliament sits in blocks throughout the year. Between sittings, select committees continue their work and MPs hold electorate office hours.
        </p>
        <div className="divide-y divide-white/8">
          {PARLIAMENT_SITTINGS.map((s) => (
            <div key={s.period} className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-white">{s.period}</span>
              <span className="text-xs text-slate-400">{s.note}</span>
            </div>
          ))}
        </div>
        <a
          href="https://www.parliament.nz/en/visit-and-learn/parliament-today/sitting-calendar/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-xs text-emerald-400 hover:text-emerald-300"
        >
          Full calendar at parliament.nz ↗
        </a>
      </section>

      {/* Past events */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Recent Past Events</h2>
        <div className="space-y-4">
          {past.map((event) => {
            const cat = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.other;
            return (
              <article key={event.title} className="card rounded-2xl p-5 opacity-80">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${cat.cls}`}>
                    {cat.label}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(event.date)}</span>
                  <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-xs text-slate-400">Past</span>
                </div>
                <h3 className="text-base font-semibold text-white">{event.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{event.description}</p>
                {event.action && (
                  <a
                    href={event.action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block text-sm font-medium text-emerald-400 hover:text-emerald-300"
                  >
                    {event.action.label} ↗
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Suggest */}
      <section className="mt-10 rounded-2xl border border-white/8 bg-white/3 px-6 py-5">
        <p className="text-sm text-slate-300">
          Know of a civic event we should include?{' '}
          <Link href="/newsletter" className="text-emerald-400 hover:text-emerald-300">
            Get in touch via our newsletter →
          </Link>
        </p>
      </section>
    </main>
  );
}
