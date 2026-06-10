import Link from 'next/link';
import { getDataClient } from '@/lib/supabase/data';
import STATIC_MPS from '@/lib/staticMps';
import { PARTY_LOGO_BY_SLUG } from '@/lib/partyLogos';

export const metadata = {
  title: 'MPs',
  description: 'Search MPs by name, party, or electorate. Neutral NZ profiles.',
};

export const revalidate = 600;

async function getData({ q = '', party = '', electorate = '' }) {
  const supabase = getDataClient();

  let query = supabase
    .from('mps')
    .select('id, full_name, slug, role, electorate, photo_url, bio_summary, party:parties(name, slug, color)')
    .eq('is_active', true)
    .order('full_name')
    .limit(200);

  if (q) {
    const safe = q.replace(/[%_\\]/g, '\\$&');
    query = query.or(`full_name.ilike.%${safe}%,role.ilike.%${safe}%,electorate.ilike.%${safe}%`);
  }

  if (party) {
    const { data: partyRow } = await supabase
      .from('parties')
      .select('id')
      .eq('slug', party)
      .single();
    query = query.eq('party_id', partyRow?.id ?? '00000000-0000-0000-0000-000000000000');
  }

  if (electorate) {
    const safe = electorate.replace(/[%_\\]/g, '\\$&');
    query = query.ilike('electorate', `%${safe}%`);
  }

  const [{ data: mps, error }, { data: parties }] = await Promise.all([
    query,
    supabase.from('parties').select('id, name, slug').eq('is_parliamentary', true).order('name'),
  ]);

  if (error) return { mps: [], parties: [], dbError: true, isStatic: false };
  return { mps: mps || [], parties: parties || [], dbError: false, isStatic: false };
}

export default async function MPsPage({ searchParams }) {
  const q = searchParams?.q || '';
  const party = searchParams?.party || '';
  const electorate = searchParams?.electorate || '';

  let { mps, parties, dbError } = await getData({ q, party, electorate });

  // Supplement DB results with static MPs for any party not yet seeded
  if (!dbError && mps.length > 0 && !party && !q && !electorate) {
    const dbPartySlugs = new Set(mps.map((m) => m.party?.slug).filter(Boolean));
    const missing = STATIC_MPS.filter((m) => !dbPartySlugs.has(m.party?.slug));
    if (missing.length > 0) mps = [...mps, ...missing];
  }

  // Fall back to static data when DB is unavailable or empty
  const isStatic = dbError || mps.length === 0;
  if (isStatic) {
    let filtered = STATIC_MPS;
    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(
        (m) => m.full_name.toLowerCase().includes(lower) || m.role.toLowerCase().includes(lower) || m.electorate?.toLowerCase().includes(lower),
      );
    }
    if (party) filtered = filtered.filter((m) => m.party.slug === party);
    if (electorate) filtered = filtered.filter((m) => m.electorate?.toLowerCase().includes(electorate.toLowerCase()));
    mps = filtered;

    // Build party list from static MPs for the filter dropdown
    const seen = new Set();
    parties = STATIC_MPS.map((m) => m.party)
      .filter((p) => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true; })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">🏛️ Members of Parliament</h1>
        <p className="mt-2 text-sm text-slate-300">
          Search all MPs by name, party, and electorate. Contact details are provided for civic participation.
        </p>
      </header>

      {isStatic && (
        <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
          <p className="text-xs text-blue-200">
            Showing pre-loaded MP data from the 2023 election. For live data and full profiles, connect a database and run the seed script.
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
            <option key={p.slug} value={p.slug}>{p.name}</option>
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
          {q || party || electorate ? 'No MPs matched your filters.' : 'No MP data available — connect a database and run the seed script.'}
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mps.map((mp) => (
            <article key={mp.id} className="card rounded-2xl p-5 hover:border-white/20 transition-colors">
              <div className="mb-3 flex items-center gap-3">
                {mp.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mp.photo_url}
                    alt={mp.full_name}
                    title="Photo via Wikimedia Commons"
                    className="h-12 w-12 shrink-0 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-full bg-slate-700/60 flex items-center justify-center text-slate-300 font-medium">
                    {mp.full_name?.charAt(0)}
                  </div>
                )}
                <div className="flex items-center gap-2 min-w-0">
                  {PARTY_LOGO_BY_SLUG[mp.party?.slug] ? (
                    <div
                      className="shrink-0 flex items-center"
                      style={['nzfirst', 'maori', 'te-pati-maori'].includes(mp.party.slug)
                        ? { background: 'rgba(255,255,255,0.95)', borderRadius: '4px', padding: '2px 6px' }
                        : undefined}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={PARTY_LOGO_BY_SLUG[mp.party.slug]}
                        alt={mp.party.name}
                        className="h-5 w-auto max-w-16 object-contain"
                      />
                    </div>
                  ) : (
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: mp.party?.color || '#6b7280' }}
                      aria-hidden="true"
                    />
                  )}
                  <p className="text-xs text-slate-400 truncate">{mp.party?.name || 'Independent / Unknown'}</p>
                </div>
              </div>

              <h2 className="text-lg font-semibold text-white">{mp.full_name}</h2>
              <p className="mt-1 text-sm text-slate-300">{mp.role || 'MP'}</p>
              <p className="mt-1 text-sm text-slate-400">{mp.electorate || 'List MP'}</p>

              {mp.bio_summary && (
                <p className="mt-3 text-xs text-slate-400 leading-relaxed line-clamp-2">{mp.bio_summary}</p>
              )}

              <div className="mt-4 flex items-center justify-between">
                <Link href={`/mps/${mp.slug}`} className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
                  View profile →
                </Link>
                {mp.contact_email ? (
                  <a href={`mailto:${mp.contact_email}`} className="text-xs text-slate-400 hover:text-slate-300">
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
