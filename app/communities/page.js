import { getDataClient } from '@/lib/supabase/data';
import CommunitiesClient from '@/components/communities/CommunitiesClient';

export const metadata = {
  title: 'Communities',
  description: 'NZ political discussion groups — see what others think before you join.',
};

export const revalidate = 300;

async function getCommunityGroups() {
  try {
    const supabase = getDataClient();
    const { data, error } = await supabase
      .from('community_groups')
      .select('*, community_comments(count)')
      .order('member_count_approx', { ascending: false, nullsLast: true });
    if (error || !data) return [];
    return data.map(g => ({
      ...g,
      comment_count: g.community_comments?.[0]?.count ?? 0,
      community_comments: undefined,
    }));
  } catch {
    return [];
  }
}

export default async function CommunitiesPage() {
  const groups = await getCommunityGroups();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400 mb-1">Fair Say NZ</p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">👥 Communities</h1>
        <p className="mt-2 max-w-xl text-slate-300 text-sm leading-relaxed">
          NZ political discussion groups across the spectrum. See where the conversations are happening — and what lean they carry — before you join.
        </p>

        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <p className="text-xs text-amber-200 leading-relaxed">
            <strong>ℹ️ About echo chambers:</strong> Most online political groups skew toward a single viewpoint. This page maps the lean of each community so you can deliberately seek out different perspectives — the antidote to the algorithm.
          </p>
        </div>
      </header>

      <CommunitiesClient groups={groups} />
    </main>
  );
}
