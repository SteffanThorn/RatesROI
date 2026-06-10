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
    logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/New_Zealand_National_Party_logo.png/250px-New_Zealand_National_Party_logo.png',
    current_seats: 49,
    spectrum: 'Centre-right',
    current_leader: 'Christopher Luxon',
    government_status: 'Government (lead party)',
    ideology_description:
      'The New Zealand National Party is a centre-right party founded in 1936. It emphasises free-market economics, lower taxes, individual responsibility, and strong law enforcement. National typically supports business-friendly policy, fiscal restraint, and a pragmatic approach to social policy.',
    core_values: ['Fiscal responsibility', 'Low taxes', 'Economic growth', 'Law & order', 'Individual freedom'],
    website: 'https://www.national.org.nz',
    electorate_focus: 'General + Māori',
    maori_electorate_note: 'Contests all 7 Māori electorates at each election but rarely holds Māori seats. Most National-leaning Māori voters are enrolled on the General roll.',
    isStatic: true,
  },
  {
    id: 'labour',
    slug: 'labour',
    name: 'Labour Party',
    shortName: 'LAB',
    color: '#cc0000',
    logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/New_Zealand_Labour_Party_logo.svg/250px-New_Zealand_Labour_Party_logo.svg.png',
    current_seats: 34,
    spectrum: 'Centre-left',
    current_leader: 'Chris Hipkins',
    government_status: 'Opposition',
    ideology_description:
      "New Zealand Labour is a centre-left party founded in 1916 from the trade union movement. It prioritises social welfare, workers' rights, public services, and reducing inequality. Labour led the 2017–2023 government under Jacinda Ardern and then Chris Hipkins.",
    core_values: ["Social equality", "Workers' rights", 'Public services', 'Healthcare', 'Climate action'],
    website: 'https://www.labour.org.nz',
    electorate_focus: 'General + Māori',
    maori_electorate_note: 'Historically dominated Māori electorates for decades — held most or all 7 seats from the 1990s until 2020. Lost all Māori electorate seats to Te Pāti Māori in the 2020 and 2023 elections. Still contests all 7 Māori electorates.',
    isStatic: true,
  },
  {
    id: 'act',
    slug: 'act',
    name: 'ACT Party',
    shortName: 'ACT',
    color: '#d4a017',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Logo_of_the_ACT_New_Zealand.svg/250px-Logo_of_the_ACT_New_Zealand.svg.png',
    current_seats: 11,
    spectrum: 'Right-libertarian',
    current_leader: 'David Seymour',
    government_status: 'Government (coalition partner)',
    ideology_description:
      'ACT New Zealand is a right-libertarian party founded in 1994. It advocates for minimal government, personal freedom, free-market economics, and substantial reduction in government spending and regulation. ACT has held the Associate Justice Minister role since 2023.',
    core_values: ['Personal freedom', 'Small government', 'Free markets', 'Deregulation', 'Individual rights'],
    website: 'https://www.act.org.nz',
    electorate_focus: 'General + Māori',
    maori_electorate_note: 'Contests both General and Māori electorates. Policy position: abolish the Māori electorates and move all Māori voters onto the General roll.',
    isStatic: true,
  },
  {
    id: 'green',
    slug: 'greens',
    name: 'Green Party',
    shortName: 'GRN',
    color: '#098137',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Green_Party_of_Aotearoa_New_Zealand_logo.svg/250px-Green_Party_of_Aotearoa_New_Zealand_logo.svg.png',
    current_seats: 15,
    spectrum: 'Left / Green',
    current_leader: 'Chlöe Swarbrick & Marama Davidson',
    government_status: 'Opposition',
    ideology_description:
      'The Green Party of Aotearoa New Zealand was founded in 1990 from the Values Party tradition. It combines environmental policy with progressive social policy — climate action, income support, housing, and Te Tiriti commitments. The Greens had a confidence-and-supply agreement with Labour 2020–2023.',
    core_values: ['Climate action', 'Social justice', 'Te Tiriti', 'Environmental protection', 'Poverty reduction'],
    website: 'https://www.greens.org.nz',
    electorate_focus: 'General + Māori',
    maori_electorate_note: 'Contests both electorates. Strong Te Tiriti o Waitangi commitments. Has had Māori co-leaders (Marama Davidson) and runs strong Māori electorate candidates.',
    isStatic: true,
  },
  {
    id: 'nzfirst',
    slug: 'nzfirst',
    name: 'NZ First',
    shortName: 'NZF',
    color: '#4b5563',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/NZ_First_logo_2017.png/250px-NZ_First_logo_2017.png',
    current_seats: 8,
    spectrum: 'Populist / Centre',
    current_leader: 'Winston Peters',
    government_status: 'Government (coalition partner)',
    ideology_description:
      'New Zealand First was founded by Winston Peters in 1993 after he left National. It takes populist, nationalist positions across the spectrum — supporting NZ manufacturing, restricting immigration, opposing the "co-governance" model, and advocating for Māori electoral reform. A kingmaker party that has gone into coalition with both Labour and National.',
    core_values: ['NZ sovereignty', 'Controlled immigration', 'Superannuation', 'Law & order', 'NZ-owned assets'],
    website: 'https://www.nzfirst.org.nz',
    electorate_focus: 'General + Māori',
    maori_electorate_note: 'Contests Māori electorates but advocates abolishing them via referendum. Party position: all voters including Māori should vote on a single General roll.',
    isStatic: true,
  },
  {
    id: 'tpm',
    slug: 'maori',
    name: 'Te Pāti Māori',
    shortName: 'TPM',
    color: '#b5281e',
    logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Te_P%C4%81ti_M%C4%81ori_logo.svg/250px-Te_P%C4%81ti_M%C4%81ori_logo.svg.png',
    current_seats: 11,
    spectrum: 'Māori nationalist / Left',
    current_leader: 'Debbie Ngarewa-Packer & Rawiri Waititi',
    government_status: 'Opposition',
    ideology_description:
      'Te Pāti Māori (the Māori Party) was founded in 2004 by MPs who left Labour, and re-entered Parliament in 2020 after a term outside. It advocates for Māori self-determination (tino rangatiratanga), Treaty-based governance, Māori language and culture, and redistributive economic policy. The party holds all 7 Māori electorates as of 2023, plus party list seats. Note: Te Pāti Māori is the dedicated Māori party, but it is not the only party that contests Māori electorates — Labour, the Greens, National, ACT, and others also run candidates in all 7 seats.',
    core_values: ['Tino rangatiratanga', 'Te Tiriti', 'Te reo Māori', 'Māori electorates', 'Economic justice'],
    website: 'https://www.maoriparty.org.nz',
    electorate_focus: 'Māori electorates',
    maori_electorate_note: 'Focuses on the 7 Māori electorates. Holds all 7 as of the 2023 election, plus additional party list seats. Also campaigns nationally for the party vote among all voters.',
    isStatic: true,
  },
  {
    id: 'mana',
    slug: 'mana',
    name: 'Mana Movement',
    shortName: 'MANA',
    color: '#7c3aed',
    logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/New_Zealand_Mana_Party_logo.png/250px-New_Zealand_Mana_Party_logo.png',
    current_seats: 0,
    spectrum: 'Māori nationalist / Far-left',
    current_leader: 'Hone Harawira',
    government_status: 'Outside Parliament',
    ideology_description:
      'Te Mana (the Mana Movement) was founded in 2011 by Hone Harawira after he split from Te Pāti Māori. It holds more radical positions than TPM — prioritising Māori sovereignty, anti-poverty policy, and opposition to corporate power. Harawira held the Te Tai Tokerau Māori electorate from 2011–2014. The party contests Māori electorates at each election but has not returned to Parliament since 2014.',
    core_values: ['Tino rangatiratanga', 'Anti-poverty', 'Māori sovereignty', 'Anti-corporate', 'Economic justice'],
    website: null,
    electorate_focus: 'Māori electorates',
    maori_electorate_note: 'Contests Māori electorates only. Hone Harawira held Te Tai Tokerau from 2011–2014 and has re-contested it in subsequent elections without success.',
    isStatic: true,
  },
  {
    id: 'top',
    slug: 'top',
    name: 'The Opportunity Party',
    shortName: 'OPP',
    color: '#0891b2',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/The_Opportunity_Party_logo_2025.svg/250px-The_Opportunity_Party_logo_2025.svg.png',
    current_seats: 0,
    spectrum: 'Centre / Progressive',
    current_leader: 'Qiulae (Q) Wong',
    government_status: 'Outside Parliament',
    ideology_description:
      'The Opportunity Party is a new political force targeting the 2026 election with a platform of Unity, Innovation, and Nature. Led by impact-business founder and climate leader Qiulae Wong, the party champions evidence-based policy, ocean health, clean energy, tax reform, and direct citizens\' voice in government. It aims to break through the 5% MMP threshold with 150,000 votes.',
    core_values: ['Healthy Oceans', 'Abundant Energy', 'Tax Reset', 'Citizens\' Voice', 'Productivity'],
    website: 'https://www.opportunity.org.nz',
    electorate_focus: 'General + Māori',
    maori_electorate_note: null,
    isStatic: true,
  },
  {
    id: 'new-conservative',
    slug: 'new-conservative',
    name: 'New Conservative',
    shortName: 'NC',
    color: '#4f46e5',
    logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Conservative_Party_NZ_logo.jpg/250px-Conservative_Party_NZ_logo.jpg',
    current_seats: 0,
    spectrum: 'Right / Social conservative',
    current_leader: 'Elliot Ikilei',
    government_status: 'Outside Parliament',
    ideology_description:
      'New Conservative (originally the Conservative Party, founded 2011) advocates for traditional family values, fiscal conservatism, and opposition to Treaty-based co-governance. It holds socially conservative positions on abortion, euthanasia, and marriage, alongside support for free enterprise. Has contested every election since 2011 without reaching the 5% party vote threshold.',
    core_values: ['Family values', 'Fiscal conservatism', 'Rule of law', 'One law for all', 'Personal responsibility'],
    website: 'https://www.newconservative.nz',
    electorate_focus: 'General + Māori',
    maori_electorate_note: 'Contests General electorates. Opposes Treaty-based co-governance and Māori electorates as a separate representation mechanism.',
    isStatic: true,
  },
  {
    id: 'alcp',
    slug: 'alcp',
    name: 'Aotearoa Legalise Cannabis Party',
    shortName: 'ALCP',
    color: '#15803d',
    logo_url: 'https://upload.wikimedia.org/wikipedia/en/d/da/AotearoaLegaliseCannabisPartyLogo.png',
    current_seats: 0,
    spectrum: 'Progressive / Single-issue',
    current_leader: 'Abe Gray',
    government_status: 'Outside Parliament',
    ideology_description:
      "The Aotearoa Legalise Cannabis Party was founded in 1996 and is one of New Zealand's longest-running minor parties. Its primary platform is cannabis legalisation and regulation, alongside broader drug law reform, harm reduction, and personal freedom. Has contested every election since 1996 but has never held a seat or reached the 5% threshold.",
    core_values: ['Cannabis legalisation', 'Drug law reform', 'Personal freedom', 'Harm reduction'],
    website: null,
    electorate_focus: 'General + Māori',
    maori_electorate_note: null,
    isStatic: true,
  },
  {
    id: 'democracy-nz',
    slug: 'democracy-nz',
    name: 'Democracy NZ',
    shortName: 'DNZ',
    color: '#0369a1',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/DemocracyNZ_logo.png/250px-DemocracyNZ_logo.png',
    current_seats: 0,
    spectrum: 'Right-populist',
    current_leader: 'Matt King',
    government_status: 'Outside Parliament',
    ideology_description:
      'Democracy NZ was founded in 2022 by Matt King, former National MP for Northland. It advocates for binding citizen-initiated referendums on major policy questions, opposition to Treaty-based co-governance, tighter immigration controls, and reduced government spending. Contested the 2023 election, winning approximately 0.5% of the party vote.',
    core_values: ['Direct democracy', 'Citizen referendums', 'One law for all', 'Controlled immigration', 'Fiscal restraint'],
    website: null,
    electorate_focus: 'General + Māori',
    maori_electorate_note: 'Contests General electorates. Opposes co-governance arrangements and advocates for a single electoral roll.',
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

const ELECTORATE_FOCUS_STYLE = {
  'Māori electorates': { bg: 'rgba(181,40,30,0.15)', color: '#fca5a5', border: 'rgba(181,40,30,0.3)' },
  'General + Māori':   { bg: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: 'rgba(59,130,246,0.25)' },
  'General':           { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
};

function ElectorateExplainer() {
  return (
    <details className="mb-8 rounded-2xl overflow-hidden" style={{ background: 'rgba(8,15,30,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <summary
        className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer select-none list-none"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="font-semibold text-white text-sm">🗳️ How NZ electorates work — General vs Māori seats</span>
        <span className="text-xs text-slate-400 shrink-0">tap to expand</span>
      </summary>

      <div className="px-5 py-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 text-sm text-slate-300 leading-relaxed">
        <div>
          <p className="font-semibold text-white mb-1.5">📋 Two types of electorate</p>
          <p>
            NZ uses MMP. Every voter gets two votes: an <strong className="text-white">electorate vote</strong> (for a local
            candidate) and a <strong className="text-white">party vote</strong> (which sets each party&apos;s share of Parliament).
            There are two sets of electorates:
          </p>
          <ul className="mt-2 space-y-1.5 text-slate-400">
            <li><span className="text-blue-300 font-medium">General electorates</span> — 72 seats, open to all enrolled voters</li>
            <li><span className="text-red-300 font-medium">Māori electorates</span> — 7 seats, available only to voters on the Māori roll</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-1.5">🖊️ The Māori Electoral Option</p>
          <p>
            Eligible Māori voters can choose which roll to enrol on — General or Māori. This choice is made during the{' '}
            <strong className="text-white">Māori Electoral Option</strong>, held after each census. The number of Māori electorates
            is set by how many voters choose the Māori roll. Currently 7 seats.
          </p>
          <p className="mt-2 text-slate-500 text-xs">
            Choosing the Māori roll does not affect your party vote — it only determines which electorate candidates you can vote for.
          </p>
        </div>

        <div>
          <p className="font-semibold text-white mb-1.5">🏛️ Who contests Māori electorates?</p>
          <p>
            Any registered party can run candidates in Māori electorates. In practice, <strong className="text-white">Labour,
            Te Pāti Māori, the Greens, National, ACT, NZ First, and the Mana Movement</strong> all contest some or all Māori seats.
          </p>
          <p className="mt-2">
            Te Pāti Māori currently holds all 7, but Labour held most Māori seats from the 1990s until 2020. The Mana Movement
            held Te Tai Tokerau from 2011–2014.
          </p>
          <p className="mt-2 text-slate-500 text-xs">
            ACT and NZ First contest Māori electorates but both have policy positions to abolish them.
          </p>
        </div>
      </div>
    </details>
  );
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
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {party.government_status && (
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
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
              {party.electorate_focus && (() => {
                const style = ELECTORATE_FOCUS_STYLE[party.electorate_focus] || ELECTORATE_FOCUS_STYLE['General'];
                return (
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
                    title="Which electorates this party contests"
                  >
                    🗳️ {party.electorate_focus}
                  </span>
                );
              })()}
            </div>
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

        {/* Māori electorate note */}
        {party.maori_electorate_note && (
          <div
            className="mt-3 rounded-xl px-3 py-2.5 text-xs text-slate-400 leading-relaxed"
            style={{ background: 'rgba(181,40,30,0.07)', border: '1px solid rgba(181,40,30,0.15)' }}
          >
            <span className="font-semibold text-red-300 mr-1">🗳️ Māori electorates:</span>
            {party.maori_electorate_note}
          </div>
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

// Static context keyed by slug — used to enrich live DB results
const STATIC_CONTEXT_BY_SLUG = Object.fromEntries(
  STATIC_PARTIES.map(p => [p.slug, {
    color: p.color,
    shortName: p.shortName,
    logo_url: p.logo_url,
    electorate_focus: p.electorate_focus,
    maori_electorate_note: p.maori_electorate_note,
  }])
);

export default async function PartiesPage() {
  const dbParties = await getParties();
  const isStatic = dbParties.length === 0;

  let allParties;
  if (dbParties.length > 0) {
    // Enrich DB rows with static electorate context; prefer static logo if DB has none
    const enriched = dbParties.map(p => ({
      ...STATIC_CONTEXT_BY_SLUG[p.slug],
      ...p,
      logo_url: p.logo_url || STATIC_CONTEXT_BY_SLUG[p.slug]?.logo_url,
    }));
    // Append any static-only parties not yet in the DB (e.g. Mana)
    const dbSlugs = new Set(dbParties.map(p => p.slug));
    const staticOnly = STATIC_PARTIES.filter(p => !dbSlugs.has(p.slug));
    allParties = [...enriched, ...staticOnly];
  } else {
    allParties = STATIC_PARTIES;
  }

  const parliamentary = allParties.filter(p => !p.government_status?.toLowerCase().includes('outside'));
  const nonParliamentary = allParties.filter(p => p.government_status?.toLowerCase().includes('outside'));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">NZ Political Parties</h1>
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

      <ElectorateExplainer />

      <h2 className="text-lg font-bold text-white mb-4">🏛️ Parliamentary Parties</h2>
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {parliamentary.map((party) => (
          <PartyCard key={party.id} party={party} />
        ))}
      </section>

      {nonParliamentary.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-white mb-2">🔵 Outside Parliament</h2>
          <p className="text-sm text-slate-400 mb-4">
            Registered parties that contest elections but currently hold no seats. Included here for Māori electoral context.
          </p>
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {nonParliamentary.map((party) => (
              <PartyCard key={party.id} party={party} />
            ))}
          </section>
        </>
      )}

      <section className="rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-5">
        <p className="text-xs text-blue-200 leading-relaxed">
          <strong>Neutral disclaimer:</strong> Party descriptions are based on publicly stated positions and official party documents.
          Fair Say NZ does not endorse, rank, or recommend any party. Always read across multiple sources before forming your view.
          Seat counts are from the 2023 election — they may change due to by-elections or parliamentary changes.
        </p>
      </section>
    </main>
  );
}
