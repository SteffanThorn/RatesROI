import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import MP from '@/lib/models/MP';
import Party from '@/lib/models/Party';

export const metadata = {
  title: 'MPs',
  description: 'Search MPs by name, party, or electorate. Neutral NZ profiles.',
};

export const revalidate = 600;

async function getData({ q = '', party = '', electorate = '' }) {
  try {
    await dbConnect();
  } catch {
    return { mps: [], parties: [], dbError: true };
  }

  const filter = { isActive: true };

  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ fullName: regex }, { role: regex }, { electorate: regex }];
  }

  if (party) {
    const partyDoc = await Party.findOne({ slug: party }).select('_id').lean();
    filter.party = partyDoc?._id || null;
  }

  if (electorate) {
    filter.electorate = new RegExp(electorate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }

  const [mps, parties] = await Promise.all([
    MP.find(filter)
      .populate('party', 'name slug color')
      .sort({ fullName: 1 })
      .limit(200)
      .lean(),
    Party.find({ isParliamentary: true }).sort({ name: 1 }).select('name slug').lean(),
  ]);

  return { mps, parties, dbError: false };
}

export default async function MPsPage({ searchParams }) {
  const q = searchParams?.q || '';
  const party = searchParams?.party || '';
  const electorate = searchParams?.electorate || '';

  const { mps, parties, dbError } = await getData({ q, party, electorate });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">🏛️ Members of Parliament</h1>
        <p className="mt-2 text-sm text-slate-300">
          Search all MPs by name, party, and electorate. Contact details are provided for civic participation.
        </p>
      </header>

      {dbError && (
        <div className="mb-6 card rounded-2xl p-6 text-center">
          <p className="text-2xl mb-2">🔌</p>
          <p className="font-semibold text-white">Database not connected</p>
          <p className="mt-1 text-sm text-slate-400">
            Add a valid <code className="text-emerald-400">MONGODB_URI</code> to your <code className="text-emerald-400">.env.local</code> and run the seed script to load MP data.
          </p>
        </div>
      )}

      <form className="card mb-6 grid gap-3 rounded-2xl p-4 sm:grid-cols-4 sm:p-5" method="GET">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search name, role..."
          className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
        />

        <select
          name="party"
          defaultValue={party}
          className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
        >
          <option value="">All parties</option>
          {parties.map((p) => (
            <option key={p._id.toString()} value={p.slug}>{p.name}</option>
          ))}
        </select>

        <input
          type="text"
          name="electorate"
          defaultValue={electorate}
          placeholder="Electorate"
          className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
        />

        <button className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500">
          Apply filters
        </button>
      </form>

      <p className="mb-4 text-sm text-slate-400">{mps.length} MPs found</p>

      {mps.length === 0 ? (
        <section className="card rounded-2xl p-8 text-center text-slate-300">
          No MPs matched your filters.
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mps.map((mp) => (
            <article key={mp._id.toString()} className="card rounded-2xl p-5 hover:border-white/20 transition-colors">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: mp.party?.color || '#6b7280' }}
                  aria-hidden="true"
                />
                <p className="text-xs text-slate-400">{mp.party?.name || 'Independent / Unknown'}</p>
              </div>

              <h2 className="text-lg font-semibold text-white">{mp.fullName}</h2>
              <p className="mt-1 text-sm text-slate-300">{mp.role || 'MP'}</p>
              <p className="mt-1 text-sm text-slate-400">{mp.electorate || 'List MP'}</p>

              <div className="mt-4 flex items-center justify-between">
                <Link href={`/mps/${mp.slug}`} className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
                  View profile →
                </Link>
                {mp.contactEmail ? (
                  <a href={`mailto:${mp.contactEmail}`} className="text-xs text-slate-400 hover:text-slate-300">
                    Email
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
