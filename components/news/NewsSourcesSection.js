'use client';

import { useState } from 'react';

const BIAS_POS = {
  'left':           { pct: 8,  color: '#3b82f6' },
  'centre-left':    { pct: 30, color: '#93c5fd' },
  'centre':         { pct: 50, color: '#9ca3af' },
  'centre-right':   { pct: 70, color: '#fca5a5' },
  'right':          { pct: 92, color: '#ef4444' },
  'focused-agenda': { pct: 50, color: '#f59e0b' },
};

const TYPE_COLORS = {
  news:     'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  podcast:  'bg-violet-500/15 text-violet-300 border border-violet-500/25',
  blog:     'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  research: 'bg-teal-500/15 text-teal-300 border border-teal-500/25',
  advocacy: 'bg-orange-500/15 text-orange-300 border border-orange-500/25',
  social:   'bg-pink-500/15 text-pink-300 border border-pink-500/25',
};

const PLATFORM_ICONS = {
  web:      { icon: '🌐', label: 'Web' },
  youtube:  { icon: '▶️', label: 'YouTube' },
  podcast:  { icon: '🎙️', label: 'Podcast' },
  facebook: { icon: 'f',  label: 'Facebook' },
  x:        { icon: '𝕏', label: 'X' },
};

const VALIDITY_CONFIG = {
  high:    { icon: '🟢', label: 'High validity' },
  medium:  { icon: '🟡', label: 'Medium validity' },
  low:     { icon: '🔴', label: 'Low validity' },
  unrated: { icon: '⚪', label: 'Unrated' },
};

const DISPLAY_LABELS = {
  'centre-left':    'Centre-Left',
  'centre-right':   'Centre-Right',
  'focused-agenda': 'Focused',
};

function displayLabel(val) {
  return DISPLAY_LABELS[val] || val.charAt(0).toUpperCase() + val.slice(1);
}

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  if (!dateStr || isNaN(date.getTime())) return 'Recently';
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function BiasPill({ bias }) {
  if (!bias) return null;
  const cfg = BIAS_POS[bias];
  if (!cfg) return null;
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full border shrink-0"
      style={{
        background: `${cfg.color}20`,
        color: cfg.color,
        borderColor: `${cfg.color}40`,
      }}
    >
      {bias === 'focused-agenda' ? '🎯 Focused' : displayLabel(bias)}
    </span>
  );
}

function ArticleCard({ article }) {
  const [imgFailed, setImgFailed] = useState(false);
  const validityCfg = VALIDITY_CONFIG[article.sourceValidity] || null;
  const biasCfg = BIAS_POS[article.sourceBias];

  return (
    <article className="card rounded-2xl overflow-hidden flex flex-col hover:border-white/20 transition-colors">
      {/* Image — always reserve space for visual consistency */}
      <div className="h-44 shrink-0 overflow-hidden bg-slate-800/60">
        {article.image_url && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt=""
            className="h-full w-full object-cover opacity-90"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center text-4xl opacity-20"
            style={biasCfg ? { background: `linear-gradient(135deg, ${biasCfg.color}18 0%, transparent 100%)` } : undefined}
          >
            📰
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        {/* Source meta row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-200">{article.source}</span>
          <BiasPill bias={article.sourceBias} />
          {validityCfg && (
            <span className="text-xs text-slate-500" title={validityCfg.label}>
              {validityCfg.icon}
            </span>
          )}
          {article.hasPaywall && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 shrink-0">
              🔒 {article.hasPaywall === 'full' ? 'Subscription' : 'Paywall'}
            </span>
          )}
          <span className="text-xs text-slate-500 ml-auto shrink-0">{timeAgo(article.published_date)}</span>
        </div>

        <h2 className="text-sm font-semibold text-white mb-1.5 leading-snug">
          {article.title}
        </h2>

        {article.summary && (
          <p className="text-xs text-slate-400 leading-relaxed flex-1 line-clamp-3">
            {article.summary}
          </p>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-xs font-medium text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
        >
          Read full article →
        </a>
      </div>
    </article>
  );
}

// ── Source guide (kept as a collapsible reference) ─────────────────────────

function BiasBar({ bias }) {
  if (bias === 'focused-agenda') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 mb-1">
        <span>🎯</span>
        <span className="italic">Focused agenda</span>
      </div>
    );
  }
  const cfg = BIAS_POS[bias];
  if (!cfg) return null;
  return (
    <div className="mt-2 mb-1 relative h-3 flex items-center">
      <div
        className="h-1.5 w-full rounded-full"
        style={{ background: 'linear-gradient(to right, #3b82f6, #9ca3af, #ef4444)' }}
      />
      <div
        className="absolute w-3 h-3 rounded-full border-2"
        style={{ left: `calc(${cfg.pct}% - 6px)`, backgroundColor: 'white', borderColor: cfg.color }}
      />
    </div>
  );
}

function SourceCard({ source }) {
  const typeColor = TYPE_COLORS[source.type] || TYPE_COLORS.news;
  const validity = VALIDITY_CONFIG[source.validity_rating] || VALIDITY_CONFIG.unrated;

  let humanNote = null;
  let aiNote = null;
  if (source.validity_notes) {
    const aiIdx = source.validity_notes.indexOf('AI note:');
    if (aiIdx !== -1) {
      const before = source.validity_notes.slice(0, aiIdx).trim();
      humanNote = before || null;
      aiNote = source.validity_notes.slice(aiIdx + 'AI note:'.length).trim();
    } else {
      humanNote = source.validity_notes;
    }
  }

  return (
    <div className="card rounded-2xl p-4 flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-2">
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white hover:text-emerald-300 transition-colors text-sm leading-snug"
        >
          {source.name}
        </a>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full capitalize font-medium ${typeColor}`}>
          {source.type}
        </span>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {source.platforms.map((p) => {
          const cfg = PLATFORM_ICONS[p];
          return (
            <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
              {cfg?.icon || p} {cfg?.label || p}
            </span>
          );
        })}
      </div>

      <BiasBar bias={source.bias} />

      <div className="text-xs text-slate-300">
        {validity.icon} {validity.label}
      </div>

      {(humanNote || aiNote) && (
        <div className="text-xs text-slate-400 space-y-1">
          {humanNote && <p>{humanNote}</p>}
          {aiNote && (
            <p className="text-slate-500 italic">
              <span className="not-italic mr-0.5">🤖</span>
              <span className="text-slate-500 not-italic">AI note:</span>{' '}
              {aiNote}
            </p>
          )}
        </div>
      )}

      {source.funded_by && (
        <div className="mt-auto pt-1 border-t border-white/5 text-xs text-slate-500">
          💰 {source.funded_by}
        </div>
      )}
    </div>
  );
}

// ── Filter bar ─────────────────────────────────────────────────────────────

const BIAS_OPTIONS     = ['left', 'centre-left', 'centre', 'centre-right', 'right', 'focused-agenda'];
const TYPE_OPTIONS     = ['news', 'podcast', 'blog', 'research', 'advocacy'];
const VALIDITY_OPTIONS = ['high', 'medium', 'low'];

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
        active
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-300'
      }`}
    >
      {children}
    </button>
  );
}

function FilterGroup({ groupLabel, options, value, onChange }) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <span className="text-xs text-slate-500 shrink-0 pt-1 w-14">{groupLabel}</span>
      <div className="flex gap-1.5 flex-wrap">
        <FilterChip active={value === null} onClick={() => onChange(null)}>All</FilterChip>
        {options.map((opt) => (
          <FilterChip key={opt} active={value === opt} onClick={() => onChange(value === opt ? null : opt)}>
            {opt === 'focused-agenda' ? '🎯 Focused' : displayLabel(opt)}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export default function NewsSourcesSection({ articles = [], sources = [] }) {
  const [filters, setFilters] = useState({ type: null, bias: null, validity: null });
  const [showFilters, setShowFilters] = useState(false);

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const filtered = articles.filter((a) => {
    if (filters.type     && a.sourceType    !== filters.type)     return false;
    if (filters.bias     && a.sourceBias    !== filters.bias)     return false;
    if (filters.validity && a.sourceValidity !== filters.validity) return false;
    return true;
  });

  return (
    <section>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h2 className="text-lg font-bold text-white mr-auto">📰 Latest Articles</h2>

        {activeFilterCount > 0 && (
          <span className="text-xs text-emerald-400 font-medium">
            {filtered.length} of {articles.length}
          </span>
        )}

        <button
          onClick={() => setShowFilters((f) => !f)}
          className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
            showFilters || activeFilterCount > 0
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
          }`}
        >
          🎛 Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card rounded-2xl p-4 mb-5 space-y-3">
          <FilterGroup groupLabel="Bias"     options={BIAS_OPTIONS}     value={filters.bias}     onChange={(v) => setFilter('bias', v)} />
          <FilterGroup groupLabel="Type"     options={TYPE_OPTIONS}     value={filters.type}     onChange={(v) => setFilter('type', v)} />
          <FilterGroup groupLabel="Validity" options={VALIDITY_OPTIONS} value={filters.validity} onChange={(v) => setFilter('validity', v)} />
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters({ type: null, bias: null, validity: null })}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ✕ Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Article feed */}
      {articles.length === 0 ? (
        <div className="card rounded-2xl p-8 text-center">
          <p className="text-2xl mb-2">📡</p>
          <p className="font-semibold text-white">No articles cached yet</p>
          <p className="mt-1 text-sm text-slate-400">
            The RSS feed will populate automatically on next page load.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">No articles match the selected filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((a) => (
            <ArticleCard key={a.url} article={a} />
          ))}
        </div>
      )}

      {/* Source guide — collapsible reference */}
      {sources.length > 0 && (
        <details className="mt-10 group">
          <summary className="cursor-pointer list-none flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors w-fit">
            <span className="text-slate-600 group-open:rotate-90 transition-transform inline-block">▶</span>
            📚 Source guide — bias &amp; validity reference
          </summary>
          <div className="mt-4 space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              Bias positions and validity ratings for each tracked source. Where you see 🤖{' '}
              <em>AI note:</em> — that is an AI-researched assessment. All other notes are human editorial judgements.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sources.map((s) => (
                <SourceCard key={s.id} source={s} />
              ))}
            </div>
          </div>
        </details>
      )}
    </section>
  );
}
