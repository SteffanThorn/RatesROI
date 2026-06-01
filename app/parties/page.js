import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Party from '@/lib/models/Party';

export const metadata = {
  title: 'Parties',
  description: 'Neutral overview of New Zealand political parties represented in Parliament.',
};

export const revalidate = 3600;

const STATIC_PARTIES = [
  {
    _id: 'national',
    slug: 'national',
    name: 'National Party',
    color: '#1a56a4',
    currentSeats: 49,
    spectrum: 'Centre-right',
    current_leader: 'Christopher Luxon',
    government_status: 'Government (lead party)',
    ideologyDescription:
      'The New Zealand National Party is a centre-right party founded in 1936. It emphasises free-market economics, lower taxes, individual responsibility, and strong law enforcement. National typically supports business-friendly policy, fiscal restraint, and a pragmatic approach to social policy.',
    coreValues: ['Fiscal responsibility', 'Low taxes', 'Economic growth', 'Law & order', 'Individual freedom'],
    website: 'https://www.national.org.nz',
    isStatic: true,
  },
  {
    _id: 'labour',
    slug: 'labour',
    name: 'Labour Party',
    color: '#cc0000',
    currentSeats: 34,
    spectrum: 'Centre-left',
    current_leader: 'Chris Hipkins',
    government_status: 'Opposition',
    ideologyDescription:
      'New Zealand Labour is a centre-left party founded in 1916 from the trade union movement. It prioritises social welfare, workers\' rights, public services, and reducing inequality. Labour led the 2017–2023 government under Jacinda Ardern and then Chris Hipkins.',
    coreValues: ['Social equality', 'Workers\' rights', 'Public services', 'Healthcare', 'Climate action'],
    website: 'https://www.labour.org.nz',
    isStatic: true,
  },
  {
    _id: 'act',
    slug: 'act',
    name: 'ACT Party',
    color: '#f9c03a',
    currentSeats: 11,
    spectrum: 'Right-libertarian',
    current_leader: 'David Seymour',
    government_status: 'Government (coalition partner)',
    ideologyDescription:
      'ACT New Zealand is a right-libertarian party founded in 1994. It advocates for minimal government, personal freedom, free-market economics, and substantial reduction in government spending and regulation. ACT has held the Associate Justice Minister role since 2023.',
    coreValues: ['Personal freedom', 'Small government', 'Free markets', 'Deregulation', 'Individual rights'],
    website: 'https://www.act.org.nz',
    isStatic: true,
  },
  {
    _id: 'green',
    slug: 'green',
    name: 'Green Party',
    color: '#098137',
    currentSeats: 15,
    spectrum: 'Left / Green',
    current_leader: 'Chlöe Swarbrick & Marama Davidson (co-leaders)',
    government_status: 'Opposition',
    ideologyDescription:
      'The Green Party of Aotearoa New Zealand was founded in 1990 from the Values Party tradition. It combines environmental policy with progressive social policy — climate action, income support, housing, and Te Tiriti commitments. The Greens had a confidence-and-supply agreement with Labour 2020–2023.',
    coreValues: ['Climate action', 'Social justice', 'Te Tiriti', 'Environmental protection', 'Poverty reduction'],
    website: 'https://www.greens.org.nz',
    isStatic: true,
  },
  {
    _id: 'nzfirst',
    slug: 'nzfirst',
    name: 'NZ First',
    color: '#000000',
    currentSeats: 8,
    spectrum: 'Populist / Centre',
    current_leader: 'Winston Peters',
    government_status: 'Government (coalition partner)',
    ideologyDescription:
      'New Zealand First was founded by Winston Peters in 1993 after he left National. It takes populist, nationalist positions across the spectrum — supporting NZ manufacturing, restricting immigration, opposing the "co-governance" model, and advocating for Māori electoral reform. A kingmaker party that has gone into coalition with both Labour and National.',
    coreValues: ['NZ sovereignty', 'Controlled immigration', 'Superannuation', 'Law & order', 'NZ-owned assets'],
    website: 'https://www.nzfirst.org.nz',
    isStatic: true,
  },
  {
    _id: 'tpm',
    slug: 'te-pati-maori',
    name: 'Te Pāti Māori',
    color: '#b5281e',
    currentSeats: 6,
    spectrum: 'Māori nationalist / Left',
    current_leader: 'Debbie Ngarewa-Packer & Rawiri Waititi (co-leaders)',
    government_status: 'Opposition',
    ideologyDescription:
      'Te Pāti Māori (the Māori Party) was re-established in 2004 and re-entered Parliament in 2020. It advocates for Māori self-determination (tino rangatiratanga), Treaty-based governance, Māori language and culture, and redistributive economic policy. The party holds all seven Māori electorates.',
    coreValues: ['Tino rangatiratanga', 'Te Tiriti', 'Te reo Māori', 'Māori electorates', 'Economic justice'],
    website: 'https://www.maoriparty.org.nz',
    isStatic: true,
  },
];

async function getParties() {
  try {
    await dbConnect();
    return Party.find({ isParliamentary: true })
      .sort({ currentSeats: -1, name: 1 })
      .lean();
  } catch {
    return [];
  }
}

export default async function PartiesPage() {
  const dbParties = await getParties();
  const parties = dbParties.length > 0 ? dbParties : STATIC_PARTIES;
  const isStatic = dbParties.length === 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">🗳️ Parliamentary Parties</h1>
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
          <article key={party._id.toString()} className="card rounded-2xl p-5 hover:border-white/20 transition-colors flex flex-col">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: party.color || '#6b7280' }}
                  aria-hidden="true"
                />
                <h2 className="text-base font-semibold text-white truncate">{party.name}</h2>
              </div>
              <span className="shrink-0 rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs text-slate-300">
                {party.currentSeats || 0} seats
              </span>
            </div>

            {party.spectrum && (
              <p className="mb-2 text-xs text-slate-400">{party.spectrum}</p>
            )}

            {party.current_leader && (
              <p className="mb-3 text-xs text-slate-400">Leader: <span className="text-slate-300">{party.current_leader}</span></p>
            )}

            {party.government_status && (
              <p className="mb-3 text-xs">
                <span
                  className={`rounded-full px-2 py-0.5 ${
                    party.government_status.toLowerCase().includes('government')
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-slate-700/60 text-slate-300'
                  }`}
                >
                  {party.government_status}
                </span>
              </p>
            )}

            {party.ideologyDescription ? (
              <p className="line-clamp-4 text-sm text-slate-300 flex-1">{party.ideologyDescription}</p>
            ) : (
              <p className="text-sm text-slate-400 flex-1">No summary available yet.</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {(party.coreValues || []).slice(0, 4).map((value) => (
                <span key={value} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300">
                  {value}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              {!party.isStatic ? (
                <Link href={`/parties/${party.slug}`} className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
                  View full profile →
                </Link>
              ) : (
                <span />
              )}
              {party.website ? (
                <a
                  href={party.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-300"
                >
                  Website ↗
                </a>
              ) : null}
            </div>
          </article>
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
