import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import MP from '@/lib/models/MP';

export const revalidate = 600;

async function getMP(slug) {
  await dbConnect();
  return MP.findOne({ slug, isActive: true }).populate('party', 'name slug color').lean();
}

export async function generateMetadata({ params }) {
  const mp = await getMP(params.slug);
  if (!mp) return { title: 'MP not found' };
  return {
    title: mp.fullName,
    description: `Neutral profile for ${mp.fullName}${mp.electorate ? `, ${mp.electorate}` : ''}.`,
  };
}

export default async function MPProfilePage({ params }) {
  const mp = await getMP(params.slug);
  if (!mp) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/mps" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to MPs</Link>

      <header className="mt-4 card rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-5">
          {mp.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mp.photoUrl} alt={mp.fullName} className="h-28 w-24 rounded-xl object-cover border border-white/10" />
          ) : (
            <div className="flex h-28 w-24 items-center justify-center rounded-xl border border-white/10 bg-slate-900/50 text-3xl">🏛️</div>
          )}

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: mp.party?.color || '#6b7280' }} aria-hidden="true" />
              {mp.party?.slug ? (
                <Link href={`/parties/${mp.party.slug}`} className="text-sm text-slate-300 hover:text-white">
                  {mp.party.name}
                </Link>
              ) : (
                <span className="text-sm text-slate-400">Party unknown</span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-white">{mp.fullName}</h1>
            <p className="mt-1 text-slate-300">{mp.role || 'MP'}</p>
            <p className="text-sm text-slate-400">{mp.electorate || 'List MP'}</p>
          </div>
        </div>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card rounded-2xl p-5">
          <h2 className="font-semibold text-white">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>
              <span className="text-slate-400">Email: </span>
              {mp.contactEmail ? (
                <a href={`mailto:${mp.contactEmail}`} className="text-emerald-400 hover:text-emerald-300">{mp.contactEmail}</a>
              ) : (
                <span>Not listed</span>
              )}
            </li>
            <li>
              <span className="text-slate-400">Parliament profile: </span>
              {mp.parliamentPageUrl ? (
                <a href={mp.parliamentPageUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">
                  Open ↗
                </a>
              ) : (
                <span>Not listed</span>
              )}
            </li>
          </ul>
        </div>

        <div className="card rounded-2xl p-5">
          <h2 className="font-semibold text-white">Core values</h2>
          {(mp.coreValues || []).length ? (
            <ul className="mt-3 space-y-2">
              {mp.coreValues.map((value) => (
                <li key={value} className="text-sm text-slate-300">• {value}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No values listed yet.</p>
          )}
        </div>
      </section>

      <section className="mt-6 card rounded-2xl p-6">
        <h2 className="font-semibold text-white">Bio summary</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
          {mp.bioSummary || 'No biography summary available yet.'}
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
        <p className="text-xs text-amber-200 leading-relaxed">
          Fair Say NZ provides neutral profile data for civic education. Verify details via official Parliament and party websites.
        </p>
      </section>
    </main>
  );
}
