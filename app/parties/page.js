import Link from 'next/link';
import { getDataClient } from '@/lib/supabase/data';

export const metadata = {
  title: 'Parties',
  description: 'Neutral overview of New Zealand political parties represented in Parliament.',
};

export const revalidate = 3600;

const STATIC_PARTIES = [
  {
    id: 'national',
    slug: 'national',
    name: 'National Party',
    shortName: 'NAT',
    color: '#1a56a4',
    logo_url: 'https://elections.nz/assets/Party-logos/Low-Resolution-300px.jpg',
    current_seats: 49,
    spectrum: 'Centre-right',
    current_leader: 'Christopher Luxon',
    government_status: 'Government (lead party)',
    ideology_description:
      'The New Zealand National Party is a centre-right party founded in 1936. It emphasises free-market economics, lower taxes, individual responsibility, and strong law enforcement. National typically supports business-friendly policy, fiscal restraint, and a pragmatic approach to social policy.',
    core_values: ['Fiscal responsibility', 'Low taxes', 'Economic growth', 'Law & order', 'Individual freedom'],
    website: 'https://www.national.org.nz',
    isStatic: true,
  },
  {
    id: 'labour',
    slug: 'labour',
    name: 'Labour Party',
    shortName: 'LAB',
    color: '#cc0000',
    logo_url: 'https://elections.nz/assets/Party-logos/labour-party-logo-june-2016.jpg',
    current_seats: 34,
    spectrum: 'Centre-left',
    current_leader: 'Chris Hipkins',
    government_status: 'Opposition',
    ideology_description:
      "New Zealand Labour is a centre-left party founded in 1916 from the trade union movement. It prioritises social welfare, workers' rights, public services, and reducing inequality. Labour led the 2017–2023 government under Jacinda Ardern and then Chris Hipkins.",
    core_values: ["Social equality", "Workers' rights", 'Public services', 'Healthcare', 'Climate action'],
    website: 'https://www.labour.org.nz',
    isStatic: true,
  },
  {
    id: 'act',
    slug: 'act',
    name: 'ACT Party',
    shortName: 'ACT',
    color: '#d4a017',
    logo_url: 'https://elections.nz/assets/Party-logos/the-act-party-logo-august-2019__ScaleWidthWzMwMF0.jpg',
    current_seats: 11,
    spectrum: 'Right-libertarian',
    current_leader: 'David Seymour',
    government_status: 'Government (coalition partner)',
    ideology_description:
      'ACT New Zealand is a right-libertarian party founded in 1994. It advocates for minimal government, personal freedom, free-market economics, and substantial reduction in government spending and regulation. ACT has held the Associate Justice Minister role since 2023.',
    core_values: ['Personal freedom', 'Small government', 'Free markets', 'Deregulation', 'Individual rights'],
    website: 'https://www.act.org.nz',
    isStatic: true,
  },
  {
    id: 'green',
    slug: 'green',
    name: 'Green Party',
    shortName: 'GRN',
    color: '#098137',
    logo_url: 'https://elections.nz/assets/Party-logos/green-party-logo-june-2017.jpg',
    current_seats: 15,
    spectrum: 'Left / Green',
    current_leader: 'Chlöe Swarbrick & Marama Davidson',
    government_status: 'Opposition',
    ideology_description:
      'The Green Party of Aotearoa New Zealand was founded in 1990 from the Values Party tradition. It combines environmental policy with progressive social policy — climate action, income support, housing, and Te Tiriti commitments. The Greens had a confidence-and-supply agreement with Labour 2020–2023.',
    core_values: ['Climate action', 'Social justice', 'Te Tiriti', 'Environmental protection', 'Poverty reduction'],
    website: 'https://www.greens.org.nz',
    isStatic: true,
  },
  {
    id: 'nzfirst',
    slug: 'nzfirst',
    name: 'NZ First',
    shortName: 'NZF',
    color: '#4b5563',
    logo_url: 'https://elections.nz/assets/Party-logos/nz-first-logo-june-2017.jpg',
    current_seats: 8,
    spectrum: 'Populist / Centre',
    current_leader: 'Winston Peters',
    government_status: 'Government (coalition partner)',
    ideology_description:
      'New Zealand First was founded by Winston Peters in 1993 after he left National. It takes populist, nationalist positions across the spectrum — supporting NZ manufacturing, restricting immigration, opposing the "co-governance" model, and advocating for Māori electoral reform. A kingmaker party that has gone into coalition with both Labour and National.',
    core_values: ['NZ sovereignty', 'Controlled immigration', 'Superannuation', 'Law & order', 'NZ-owned assets'],
    website: 'https://www.nzfirst.org.nz',
    isStatic: true,
  },
  {
    id: 'tpm',
    slug: 'te-pati-maori',
    name: 'Te Pāti Māori',
    shortName: 'TPM',
    color: '#b5281e',
    logo_url: 'https://elections.nz/assets/Party-logos/Maori-part-logo-Final_Maaeori-full-colour-002__ScaleWidthWzMwMF0.jpg',
    current_seats: 6,
    spectrum: 'Māori nationalist / Left',
    current_leader: 'Debbie Ngarewa-Packer & Rawiri Waititi',
    government_status: 'Opposition',
    ideology_description:
      'Te Pāti Māori (the Māori Party) was re-established in 2004 and re-entered Parliament in 2020. It advocates for Māori self-determination (tino rangatiratanga), Treaty-based governance, Māori language and culture, and redistributive economic policy. The party holds all seven Māori electorates.',
    core_values: ['Tino rangatiratanga', 'Te Tiriti', 'Te reo Māori', 'Māori electorates', 'Economic justice'],
    website: 'https://www.maoriparty.org.nz',
    isStatic: true,
  },
  {
    id: 'top',
    slug: 'top',
    name: 'The Opportunity Party',
    shortName: 'OPP',
    color: '#0891b2',
    logo_url: 'https://elections.nz/assets/Party-logos/Opportunity_Logo_Colour_RGB-v2__ScaleWidthWzMwMF0.jpg',
    current_seats: 0,
    spectrum: 'Centre / Progressive',
    current_leader: 'Qiulae (Q) Wong',
    government_status: 'Outside Parliament',
    ideology_description:
      'The Opportunity Party is a new political force targeting the 2026 election with a platform of Unity, Innovation, and Nature. Led by impact-business founder and climate leader Qiulae Wong, the party champions evidence-based policy, ocean health, clean energy, tax reform, and direct citizens\' voice in government. It aims to break through the 5% MMP threshold with 150,000 votes.',
    core_values: ['Healthy Oceans', 'Abundant Energy', 'Tax Reset', 'Citizens\' Voice', 'Productivity'],
    website: 'https://www.opportunity.org.nz',
    isStatic: true,
  },
];

async function getParties() {
  try {
    const supabase = getDataClient();
    const { data, error } = await supabase
      .from('parties')
      .select('*')
      .eq('is_parliamentary', true)
      .order('current_seats', { ascending: false });
    if (error || !data?.length) return [];
    return data;
  } catch {
    return [];
  }
}

function leaderInitials(name) {
  if (!name) return '';
  return name
    .split(/[\s&,]+/)
    .filter(w => w.length > 1)
    .map(w => w[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

function PartyCard({ party }) {
  const badge = party.shortName || party.name.slice(0, 3).toUpperCase();
  const leaderBadge = leaderInitials(party.current_leader);
  const isGovt = party.government_status?.toLowerCase().includes('government');
  const isOutside = party.government_status?.toLowerCase().includes('outside');

  return (
    <article
      className="rounded-2xl overflow-hidden flex flex-col hover:-translate-y-0.5 transition-transform duration-200"
      style={{
        background: 'rgba(8,15,30,0.88)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px ${party.color}18`,
      }}
    >
      {/* ── Coloured header ── */}
      <div
        className="px-5 pt-5 pb-4"
        style={{
          background: `linear-gradient(135deg, ${party.color}30 0%, ${party.color}0c 55%, transparent 100%)`,
          borderTop: `3px solid ${party.color}`,
        }}
      >
        <div className="flex items-start gap-3">
          {/* Party badge / logo */}
          {party.logo_url ? (
            <div
              className="rounded-lg flex items-center justify-center px-2.5 shrink-0"
              style={{
                background: 'rgba(255,255,255,0.96)',
                minWidth: '90px',
                height: '44px',
                boxShadow: `0 2px 12px ${party.color}40`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={party.logo_url}
                alt={`${party.name} logo`}
                className="h-7 w-auto object-contain max-w-20"
              />
            </div>
          ) : (
            <div
              className="h-11 w-14 rounded-xl flex items-center justify-center shrink-0 font-black text-sm tracking-widest"
              style={{
                background: party.color,
                color: 'white',
                boxShadow: `0 4px 14px ${party.color}55`,
              }}
            >
              {badge}
            </div>
          )}

          {/* Name + spectrum + status */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white leading-snug">{party.name}</h2>
            {party.spectrum && (
              <p className="mt-0.5 text-xs font-medium" style={{ color: `${party.color}cc` }}>
                {party.spectrum}
              </p>
            )}
            {party.government_status && (
              <span
                className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={
                  isGovt
                    ? { background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' }
                    : isOutside
                    ? { background: `${party.color}18`, color: `${party.color}cc` }
                    : { background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }
                }
              >
                {party.government_status}
              </span>
            )}
          </div>

          {/* Seat count */}
          <div className="text-right shrink-0 pt-0.5">
            <p className="text-2xl font-black leading-none tabular-nums" style={{ color: party.color }}>
              {party.current_seats ?? 0}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">seats</p>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-5 py-4">
        {/* Leader */}
        {party.current_leader && (
          <div
            className="flex items-center gap-2.5 mb-4 pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: `${party.color}22`,
                color: party.color,
                border: `1.5px solid ${party.color}45`,
              }}
            >
              {leaderBadge}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 leading-none mb-0.5">Party Leader</p>
              <p className="text-sm text-white font-medium leading-snug truncate">{party.current_leader}</p>
            </div>
          </div>
        )}

        {/* Description */}
        {party.ideology_description ? (
          <p className="line-clamp-3 text-sm text-slate-300 leading-relaxed flex-1">
            {party.ideology_description}
          </p>
        ) : (
          <p className="text-sm text-slate-500 flex-1">No summary available yet.</p>
        )}

        {/* Value chips */}
        {(party.core_values || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {(party.core_values || []).slice(0, 4).map((value) => (
              <span
                key={value}
                className="rounded-full px-2.5 py-1 text-xs"
                style={{
                  background: `${party.color}14`,
                  color: `${party.color}dd`,
                  border: `1px solid ${party.color}30`,
                }}
              >
                {value}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="mt-4 pt-3 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {!party.isStatic ? (
            <Link
              href={`/parties/${party.slug}`}
              className="text-sm font-semibold hover:opacity-70 transition-opacity"
              style={{ color: party.color }}
            >
              Full profile →
            </Link>
          ) : (
            <span />
          )}
          {party.website && (
            <a
              href={party.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Website ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function PartiesPage() {
  const dbParties = await getParties();
  const parties = dbParties.length > 0 ? dbParties : STATIC_PARTIES;
  const isStatic = dbParties.length === 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Parliamentary Parties</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300 leading-relaxed">
          Neutral, factual summaries only. Fair Say NZ does not endorse any party, MP, or ideology.
          Compare values and policy framing across multiple sources.
        </p>
      </header>

      {isStatic && (
        <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
          <p className="text-xs text-blue-200">
            Showing pre-loaded party information. Seat counts reflect the 2023 election result — numbers may have shifted.
            For live data, connect a database and run the seed script.
          </p>
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {parties.map((party) => (
          <PartyCard key={party.id} party={party} />
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-5">
        <p className="text-xs text-blue-200 leading-relaxed">
          <strong>Neutral disclaimer:</strong> Party descriptions are based on publicly stated positions and official party documents.
          Fair Say NZ does not endorse, rank, or recommend any party. Always read across multiple sources before forming your view.
          Seat counts are from the 2023 election — they may change due to by-elections or parliamentary changes.
        </p>
      </section>
    </main>
  );
}
