import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDataClient } from '@/lib/supabase/data';
import STATIC_MPS from '@/lib/staticMps';
import MP_PROFILES from '@/lib/staticMpProfiles';

export const revalidate = 600;

async function getMP(slug) {
  // Try database first
  try {
    const supabase = getDataClient();
    const { data } = await supabase
      .from('mps')
      .select('*, party:parties(name, slug, color)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    if (data) return data;
  } catch {}

  // Fall back to static data
  const staticMp = STATIC_MPS.find((m) => m.slug === slug);
  if (!staticMp) return null;
  const profile = MP_PROFILES[slug] || {};
  return { ...staticMp, ...profile };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const mp = await getMP(slug);
  if (!mp) return { title: 'MP not found' };
  return {
    title: mp.full_name,
    description: `Neutral profile for ${mp.full_name}${mp.electorate ? `, ${mp.electorate}` : ''}.`,
  };
}

function Section({ title, items, color, bullet = '→' }) {
  if (!items?.length) return null;
  return (
    <div className="card rounded-2xl p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color }}>{title}</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-300 leading-relaxed">
            <span className="mt-0.5 shrink-0 text-xs" style={{ color }}>{bullet}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function MPProfilePage({ params }) {
  const { slug } = await params;
  const mp = await getMP(slug);
  if (!mp) notFound();

  const partyColor = mp.party?.color || '#6b7280';

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/mps" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to MPs</Link>

      {/* ── Header ── */}
      <header
        className="mt-4 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(8,15,30,0.88)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          boxShadow: `0 8px 32px ${partyColor}18`,
        }}
      >
        {/* Coloured top band */}
        <div
          className="h-1.5 w-full"
          style={{ background: partyColor }}
        />

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start gap-6">
            {/* Photo */}
            {mp.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mp.photo_url}
                alt={mp.full_name}
                title="Photo via Wikimedia Commons"
                className="h-32 w-28 rounded-xl object-cover shrink-0"
                style={{ border: `2px solid ${partyColor}40` }}
              />
            ) : (
              <div
                className="flex h-32 w-28 shrink-0 items-center justify-center rounded-xl text-4xl font-black text-white"
                style={{ background: `${partyColor}25`, border: `2px solid ${partyColor}40` }}
              >
                {mp.full_name?.charAt(0)}
              </div>
            )}

            {/* Info */}
            <div className="min-w-0 flex-1">
              {mp.party?.slug ? (
                <Link
                  href={`/parties/${mp.party.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium mb-2 hover:opacity-80 transition-opacity"
                  style={{ color: partyColor }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: partyColor }} />
                  {mp.party.name}
                </Link>
              ) : (
                <p className="text-xs text-slate-400 mb-2">Party unknown</p>
              )}

              <h1 className="text-3xl font-bold text-white leading-tight">{mp.full_name}</h1>
              <p className="mt-1 text-slate-300">{mp.role || 'MP'}</p>
              <p className="mt-0.5 text-sm text-slate-400">{mp.electorate ? `Electorate: ${mp.electorate}` : 'List MP'}</p>

              {/* Contact */}
              <div className="mt-4 flex flex-wrap gap-3">
                {mp.contact_email && (
                  <a
                    href={`mailto:${mp.contact_email}`}
                    className="rounded-full px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
                    style={{ background: `${partyColor}20`, color: partyColor, border: `1px solid ${partyColor}40` }}
                  >
                    Email MP ↗
                  </a>
                )}
                {mp.parliament_page_url && (
                  <a
                    href={mp.parliament_page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    Parliament profile ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Profile sections ── */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Section
          title="Before Politics"
          items={mp.career_before_politics}
          color={partyColor}
          bullet="◆"
        />
        <Section
          title="Parliamentary Career"
          items={mp.career_in_politics}
          color={partyColor}
          bullet="◆"
        />
      </div>

      <div className="mt-4">
        <Section
          title="Key Positions"
          items={mp.key_positions}
          color={partyColor}
          bullet="→"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Section
          title="Accomplishments"
          items={mp.accomplishments}
          color="#10b981"
          bullet="✓"
        />

        {mp.controversies?.length ? (
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(245,158,11,0.05)',
              border: '1px solid rgba(245,158,11,0.2)',
            }}
          >
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-400">Controversies</h2>
            <ul className="space-y-2">
              {mp.controversies.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300 leading-relaxed">
                  <span className="mt-0.5 shrink-0 text-xs text-amber-400">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* bio_summary fallback for DB records that have it */}
      {mp.bio_summary && (
        <div className="mt-4 card rounded-2xl p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: partyColor }}>Bio Summary</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{mp.bio_summary}</p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
        <p className="text-xs text-amber-200 leading-relaxed">
          <strong>Neutral disclaimer:</strong> Fair Say NZ provides neutral profile data for civic education purposes.
          Information is based on publicly available sources. Verify via official Parliament and party websites before acting on any detail.
        </p>
      </div>
    </main>
  );
}
