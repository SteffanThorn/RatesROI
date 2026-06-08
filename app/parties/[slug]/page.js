import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDataClient } from '@/lib/supabase/data';
import STATIC_MPS from '@/lib/staticMps';

export const revalidate = 3600;

const STATIC_PARTIES = [
  {
    id: 'national', slug: 'national', name: 'National Party', shortName: 'NAT', color: '#1a56a4',
    logo_url: 'https://elections.nz/assets/Party-logos/Low-Resolution-300px.jpg',
    current_seats: 49, spectrum: 'Centre-right', current_leader: 'Christopher Luxon',
    government_status: 'Government (lead party)', founded_year: 1936, is_parliamentary: true,
    ideology_description: 'The New Zealand National Party is a centre-right party founded in 1936. It emphasises free-market economics, lower taxes, individual responsibility, and strong law enforcement. National typically supports business-friendly policy, fiscal restraint, and a pragmatic approach to social policy.',
    core_values: ['Fiscal responsibility', 'Low taxes', 'Economic growth', 'Law & order', 'Individual freedom'],
    website: 'https://www.national.org.nz',
  },
  {
    id: 'labour', slug: 'labour', name: 'Labour Party', shortName: 'LAB', color: '#cc0000',
    logo_url: 'https://elections.nz/assets/Party-logos/labour-party-logo-june-2016.jpg',
    current_seats: 34, spectrum: 'Centre-left', current_leader: 'Chris Hipkins',
    government_status: 'Opposition', founded_year: 1916, is_parliamentary: true,
    ideology_description: "New Zealand Labour is a centre-left party founded in 1916 from the trade union movement. It prioritises social welfare, workers' rights, public services, and reducing inequality. Labour led the 2017–2023 government under Jacinda Ardern and then Chris Hipkins.",
    core_values: ["Social equality", "Workers' rights", 'Public services', 'Healthcare', 'Climate action'],
    website: 'https://www.labour.org.nz',
  },
  {
    id: 'act', slug: 'act', name: 'ACT Party', shortName: 'ACT', color: '#d4a017',
    logo_url: 'https://elections.nz/assets/Party-logos/the-act-party-logo-august-2019__ScaleWidthWzMwMF0.jpg',
    current_seats: 11, spectrum: 'Right-libertarian', current_leader: 'David Seymour',
    government_status: 'Government (coalition partner)', founded_year: 1994, is_parliamentary: true,
    ideology_description: 'ACT New Zealand is a right-libertarian party founded in 1994. It advocates for minimal government, personal freedom, free-market economics, and substantial reduction in government spending and regulation.',
    core_values: ['Personal freedom', 'Small government', 'Free markets', 'Deregulation', 'Individual rights'],
    website: 'https://www.act.org.nz',
  },
  {
    id: 'green', slug: 'green', name: 'Green Party', shortName: 'GRN', color: '#098137',
    logo_url: 'https://elections.nz/assets/Party-logos/green-party-logo-june-2017.jpg',
    current_seats: 15, spectrum: 'Left / Green', current_leader: 'Chlöe Swarbrick & Marama Davidson',
    government_status: 'Opposition', founded_year: 1990, is_parliamentary: true,
    ideology_description: 'The Green Party of Aotearoa New Zealand was founded in 1990 from the Values Party tradition. It combines environmental policy with progressive social policy — climate action, income support, housing, and Te Tiriti commitments.',
    core_values: ['Climate action', 'Social justice', 'Te Tiriti', 'Environmental protection', 'Poverty reduction'],
    website: 'https://www.greens.org.nz',
  },
  {
    id: 'nzfirst', slug: 'nzfirst', name: 'NZ First', shortName: 'NZF', color: '#4b5563',
    logo_url: 'https://elections.nz/assets/Party-logos/nz-first-logo-june-2017.jpg',
    current_seats: 8, spectrum: 'Populist / Centre', current_leader: 'Winston Peters',
    government_status: 'Government (coalition partner)', founded_year: 1993, is_parliamentary: true,
    ideology_description: 'New Zealand First was founded by Winston Peters in 1993 after he left National. It takes populist, nationalist positions — supporting NZ manufacturing, restricting immigration, opposing co-governance, and advocating for Māori electoral reform.',
    core_values: ['NZ sovereignty', 'Controlled immigration', 'Superannuation', 'Law & order', 'NZ-owned assets'],
    website: 'https://www.nzfirst.org.nz',
  },
  {
    id: 'tpm', slug: 'te-pati-maori', name: 'Te Pāti Māori', shortName: 'TPM', color: '#b5281e',
    logo_url: 'https://elections.nz/assets/Party-logos/Maori-part-logo-Final_Maaeori-full-colour-002__ScaleWidthWzMwMF0.jpg',
    current_seats: 6, spectrum: 'Māori nationalist / Left', current_leader: 'Debbie Ngarewa-Packer & Rawiri Waititi',
    government_status: 'Opposition', founded_year: 2004, is_parliamentary: true,
    ideology_description: 'Te Pāti Māori advocates for Māori self-determination (tino rangatiratanga), Treaty-based governance, Māori language and culture, and redistributive economic policy. The party holds all seven Māori electorates.',
    core_values: ['Tino rangatiratanga', 'Te Tiriti', 'Te reo Māori', 'Māori electorates', 'Economic justice'],
    website: 'https://www.maoriparty.org.nz',
  },
  {
    id: 'top', slug: 'top', name: 'The Opportunity Party', shortName: 'OPP', color: '#0891b2',
    logo_url: 'https://elections.nz/assets/Party-logos/Opportunity_Logo_Colour_RGB-v2__ScaleWidthWzMwMF0.jpg',
    current_seats: 0, spectrum: 'Centre / Progressive', current_leader: 'Qiulae (Q) Wong',
    government_status: 'Outside Parliament', founded_year: 2025, is_parliamentary: false,
    ideology_description: "The Opportunity Party is a new political force targeting the 2026 election with a platform of Unity, Innovation, and Nature. Led by impact-business founder Qiulae Wong, the party champions evidence-based policy, ocean health, clean energy, tax reform, and direct citizens' voice in government.",
    core_values: ['Healthy Oceans', 'Abundant Energy', 'Tax Reset', "Citizens' Voice", 'Productivity'],
    website: 'https://www.opportunity.org.nz',
  },
];

async function getParty(slug) {
  try {
    const supabase = getDataClient();
    const { data: party, error } = await supabase
      .from('parties')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && party) {
      const { data: mps } = await supabase
        .from('mps')
        .select('id, full_name, slug, role, electorate, photo_url')
        .eq('party_id', party.id)
        .eq('is_active', true)
        .order('role')
        .order('full_name');
      return { party, mps: mps || [], isStatic: false };
    }
  } catch {}

  // Fall back to static data
  const party = STATIC_PARTIES.find((p) => p.slug === slug);
  if (!party) return null;
  const mps = STATIC_MPS.filter((m) => m.party?.slug === slug);
  return { party, mps, isStatic: true };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getParty(slug);
  if (!data) return { title: 'Party not found' };
  return {
    title: data.party.name,
    description: `Neutral profile for ${data.party.name} in New Zealand politics.`,
  };
}

export default async function PartyDetailPage({ params }) {
  const { slug } = await params;
  const data = await getParty(slug);
  if (!data) notFound();

  const { party, mps, isStatic } = data;
  const color = party.color || '#6b7280';

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/parties" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to parties</Link>

      {isStatic && (
        <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
          <p className="text-xs text-blue-200">
            Showing pre-loaded party data. For live data, connect a database and run the seed script.
          </p>
        </div>
      )}

      {/* ── Header ── */}
      <header
        className="mt-4 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(8,15,30,0.88)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          boxShadow: `0 8px 32px ${color}18`,
        }}
      >
        <div className="h-1.5 w-full" style={{ background: color }} />
        <div
          className="px-6 py-6 sm:px-8 sm:py-8"
          style={{ background: `linear-gradient(135deg, ${color}22 0%, ${color}08 55%, transparent 100%)` }}
        >
          <div className="flex flex-wrap items-center gap-4">
            {party.logo_url ? (
              <div
                className="rounded-xl flex items-center justify-center px-3 shrink-0"
                style={{ background: 'rgba(255,255,255,0.96)', minWidth: '100px', height: '52px', boxShadow: `0 2px 12px ${color}40` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={party.logo_url} alt={`${party.name} logo`} className="h-8 w-auto object-contain max-w-24" />
              </div>
            ) : (
              <span className="h-5 w-5 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-white leading-tight">{party.name}</h1>
              {party.spectrum && (
                <p className="mt-1 text-sm font-medium" style={{ color: `${color}cc` }}>{party.spectrum}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-black tabular-nums" style={{ color }}>{party.current_seats ?? 0}</p>
              <p className="text-xs text-slate-500">seats</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
              <p className="text-xs text-slate-400">Founded</p>
              <p className="mt-1 font-medium text-white">{party.founded_year || 'Unknown'}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
              <p className="text-xs text-slate-400">Status</p>
              <p className="mt-1 font-medium text-white">{party.government_status || (party.is_parliamentary ? 'In Parliament' : 'Outside Parliament')}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
              <p className="text-xs text-slate-400">Official website</p>
              {party.website ? (
                <a href={party.website} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-medium text-emerald-400 hover:text-emerald-300">
                  Visit ↗
                </a>
              ) : (
                <p className="mt-1 font-medium text-white">Not listed</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Ideology ── */}
      <section className="mt-5 card rounded-2xl p-6 sm:p-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color }}>About this party</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
          {party.ideology_description || 'No description available yet.'}
        </p>
      </section>

      {/* ── Core values ── */}
      {(party.core_values || []).length > 0 && (
        <section className="mt-4 card rounded-2xl p-6 sm:p-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color }}>Core values</h2>
          <div className="flex flex-wrap gap-2">
            {party.core_values.map((value) => (
              <span
                key={value}
                className="rounded-full px-3 py-1.5 text-sm"
                style={{ background: `${color}14`, color: `${color}dd`, border: `1px solid ${color}30` }}
              >
                {value}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── MPs ── */}
      <section className="mt-4 card rounded-2xl p-6 sm:p-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color }}>
          MPs in this party {mps.length > 0 && <span className="ml-2 text-slate-500 font-normal normal-case">({mps.length})</span>}
        </h2>
        {mps.length ? (
          <ul className="divide-y divide-white/10">
            {mps.map((mp) => (
              <li key={mp.id}>
                <Link href={`/mps/${mp.slug}`} className="group flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    {mp.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mp.photo_url}
                        alt={mp.full_name}
                        title="Photo via Wikimedia Commons"
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                        style={{ border: `1.5px solid ${color}40` }}
                      />
                    ) : (
                      <div
                        className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: `${color}22`, color, border: `1.5px solid ${color}40` }}
                      >
                        {mp.full_name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-white group-hover:text-emerald-300 transition-colors">{mp.full_name}</p>
                      <p className="text-sm text-slate-400">{mp.role || 'MP'}{mp.electorate ? ` · ${mp.electorate}` : ''}</p>
                    </div>
                  </div>
                  <span className="text-sm text-emerald-400 shrink-0">Profile →</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400">No MPs linked yet.</p>
        )}
      </section>

      <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
        <p className="text-xs text-amber-200 leading-relaxed">
          <strong>Neutral disclaimer:</strong> Party descriptions are based on publicly stated positions and official party documents.
          Fair Say NZ does not endorse, rank, or recommend any party. Always read across multiple sources before forming your view.
        </p>
      </div>
    </main>
  );
}
