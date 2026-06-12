'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Matches the BIAS_POS palette used in NewsSourcesSection
const LEAN_CONFIG = {
  'left':         { color: '#3b82f6', label: 'Left' },
  'centre-left':  { color: '#93c5fd', label: 'Centre-Left' },
  'centre':       { color: '#9ca3af', label: 'Centre' },
  'centre-right': { color: '#fca5a5', label: 'Centre-Right' },
  'right':        { color: '#ef4444', label: 'Right' },
  'mixed':        { color: '#a855f7', label: 'Mixed' },
};

const PLATFORM_CONFIG = {
  facebook:  { label: 'Facebook',  icon: 'f' },
  whatsapp:  { label: 'WhatsApp',  icon: 'W' },
  telegram:  { label: 'Telegram',  icon: 't' },
  reddit:    { label: 'Reddit',    icon: 'r' },
  other:     { label: 'Other',     icon: '○' },
};

const LEAN_FILTERS     = ['left', 'centre-left', 'centre', 'centre-right', 'right', 'mixed'];
const PLATFORM_FILTERS = ['facebook', 'whatsapp', 'telegram', 'reddit', 'other'];
const MAX_DESC = 140;

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 text-xs px-2.5 py-1 rounded-full border transition-colors ${
        active
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-300'
      }`}
    >
      {children}
    </button>
  );
}

function LeanBadge({ lean }) {
  const cfg = LEAN_CONFIG[lean];
  if (!cfg) return null;
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full border shrink-0"
      style={{ background: `${cfg.color}20`, color: cfg.color, borderColor: `${cfg.color}40` }}
    >
      {cfg.label}
    </span>
  );
}

function PlatformBadge({ platform }) {
  const cfg = PLATFORM_CONFIG[platform] || { label: platform, icon: '?' };
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 shrink-0 font-mono">
      {cfg.icon} {cfg.label}
    </span>
  );
}

function CommentsSection({ groupId, initialCount, isLoggedIn }) {
  const [open, setOpen]         = useState(false);
  const [comments, setComments] = useState([]);
  const [loaded, setLoaded]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [body, setBody]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');
  const [count, setCount]       = useState(initialCount);

  async function loadComments() {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/communities/${groupId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
        setCount(data.length);
      }
    } catch { /* silent */ }
    finally { setLoading(false); setLoaded(true); }
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !loaded) loadComments();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = body.trim();
    if (trimmed.length < 10) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/communities/${groupId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: trimmed }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to post');
        return;
      }
      const newComment = await res.json();
      setComments(prev => [newComment, ...prev]);
      setCount(c => c + 1);
      setBody('');
    } catch {
      setError('Network error — please try again');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border-t border-white/5 mt-4 pt-4">
      <button
        onClick={toggle}
        className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span className="text-slate-600">{open ? '▾' : '▸'}</span>
        {count > 0
          ? `${count} experience${count !== 1 ? 's' : ''} shared`
          : 'No experiences shared yet'}
      </button>

      {open && (
        <div className="mt-3 space-y-2.5">
          {loading && (
            <>
              <div className="h-10 rounded-xl bg-white/5 animate-pulse" />
              <div className="h-10 rounded-xl bg-white/5 animate-pulse" />
            </>
          )}

          {loaded && comments.length === 0 && !loading && (
            <p className="text-xs text-slate-500 py-1">No experiences shared yet. Be the first.</p>
          )}

          {comments.map(c => (
            <div
              key={c.id}
              className="rounded-xl px-3 py-2.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p className="text-xs text-slate-300 leading-relaxed">{c.body}</p>
              <p className="mt-1 text-xs text-slate-600">{timeAgo(c.created_at)}</p>
            </div>
          ))}

          {isLoggedIn ? (
            <form onSubmit={handleSubmit} className="mt-2">
              <div className="relative">
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Share your experience in this group…"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-emerald-500/40 transition-colors"
                />
                <span className="absolute bottom-2 right-3 text-xs text-slate-600 select-none">
                  {body.length}/500
                </span>
              </div>
              {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={submitting || body.trim().length < 10}
                className="mt-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Posting…' : 'Share experience'}
              </button>
            </form>
          ) : (
            <p className="text-xs text-slate-500 mt-2">
              <Link href="/auth/signin" className="text-emerald-400 hover:underline">
                Log in
              </Link>{' '}
              to share your experience in this group.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function GroupCard({ group, isLoggedIn }) {
  const [descExpanded, setDescExpanded] = useState(false);
  const leanCfg = LEAN_CONFIG[group.lean];
  const isLong  = (group.description?.length ?? 0) > MAX_DESC;

  return (
    <article
      className="rounded-2xl overflow-hidden flex flex-col hover:-translate-y-0.5 transition-transform duration-200"
      style={{
        background: 'rgba(8,15,30,0.88)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
        boxShadow: leanCfg ? `0 8px 32px ${leanCfg.color}18` : undefined,
      }}
    >
      {/* Coloured header strip */}
      <div
        className="px-5 pt-5 pb-4"
        style={leanCfg
          ? { background: `linear-gradient(135deg, ${leanCfg.color}22 0%, transparent 70%)`, borderTop: `3px solid ${leanCfg.color}` }
          : { borderTop: '3px solid rgba(255,255,255,0.08)' }
        }
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-bold text-white leading-snug flex-1">{group.name}</h2>
          {group.is_verified && (
            <span
              className="shrink-0 text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
              title="Verified — curated by Fair Say NZ"
            >
              ✓ Verified
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          <PlatformBadge platform={group.platform} />
          {group.lean && <LeanBadge lean={group.lean} />}
          {group.member_count_approx != null && (
            <span className="text-xs text-slate-500">
              ~{group.member_count_approx.toLocaleString()} members
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-5 py-4">
        {group.description && (
          <div className="mb-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              {descExpanded || !isLong
                ? group.description
                : `${group.description.slice(0, MAX_DESC)}…`}
            </p>
            {isLong && (
              <button
                onClick={() => setDescExpanded(e => !e)}
                className="mt-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {descExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        <div className="mt-auto">
          {group.url && (
            <a
              href={group.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-white/25 hover:text-white transition-colors"
            >
              Join group →
            </a>
          )}
        </div>

        <CommentsSection
          groupId={group.id}
          initialCount={group.comment_count}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </article>
  );
}

export default function CommunitiesClient({ groups = [] }) {
  const { status }                          = useSession();
  const [leanFilter, setLeanFilter]         = useState(null);
  const [platformFilter, setPlatformFilter] = useState(null);

  const isLoggedIn  = status === 'authenticated';
  const activeCount = [leanFilter, platformFilter].filter(Boolean).length;

  const filtered = groups.filter(g => {
    if (leanFilter     && g.lean     !== leanFilter)     return false;
    if (platformFilter && g.platform !== platformFilter) return false;
    return true;
  });

  return (
    <section>
      {/* Filter bar */}
      <div className="card rounded-2xl p-4 mb-6 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-xs text-slate-500 shrink-0 pt-1 w-16">Lean</span>
          <div className="flex gap-1.5 flex-wrap">
            <FilterChip active={leanFilter === null} onClick={() => setLeanFilter(null)}>All</FilterChip>
            {LEAN_FILTERS.map(l => (
              <FilterChip
                key={l}
                active={leanFilter === l}
                onClick={() => setLeanFilter(leanFilter === l ? null : l)}
              >
                {LEAN_CONFIG[l]?.label ?? l}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-xs text-slate-500 shrink-0 pt-1 w-16">Platform</span>
          <div className="flex gap-1.5 flex-wrap">
            <FilterChip active={platformFilter === null} onClick={() => setPlatformFilter(null)}>All</FilterChip>
            {PLATFORM_FILTERS.map(p => (
              <FilterChip
                key={p}
                active={platformFilter === p}
                onClick={() => setPlatformFilter(platformFilter === p ? null : p)}
              >
                {PLATFORM_CONFIG[p]?.label ?? p}
              </FilterChip>
            ))}
          </div>
        </div>

        {activeCount > 0 && (
          <button
            onClick={() => { setLeanFilter(null); setPlatformFilter(null); }}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ✕ Clear filters
          </button>
        )}
      </div>

      {activeCount > 0 && (
        <p className="text-xs text-slate-400 mb-4">
          {filtered.length} of {groups.length} communities
        </p>
      )}

      {/* Grid */}
      {groups.length === 0 ? (
        <div className="card rounded-2xl p-8 text-center">
          <p className="text-2xl mb-2">👥</p>
          <p className="font-semibold text-white">No communities listed yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Communities are curated by the Fair Say NZ team. Check back soon.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">
          No communities match the selected filters.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {filtered.map(g => (
            <GroupCard key={g.id} group={g} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      )}

      <section className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-5">
        <h3 className="mb-2 text-sm font-semibold text-white">Breaking out of echo chambers</h3>
        <p className="text-xs text-blue-200 leading-relaxed">
          Research shows that people who consume only one political viewpoint hold more extreme positions and are less able to accurately describe what the other side actually believes. Try joining one group from across the spectrum — even just to observe. Understanding others&apos; arguments makes for better civic participation.
        </p>
      </section>
    </section>
  );
}
