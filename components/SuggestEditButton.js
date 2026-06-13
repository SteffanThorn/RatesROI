'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

const CATEGORIES = [
  { value: 'factual_error', label: '❌ Factual error'         },
  { value: 'missing_info',  label: '➕ Missing information'   },
  { value: 'bias_concern',  label: '⚖️ Bias concern'          },
  { value: 'outdated',      label: '🕐 Outdated information'  },
  { value: 'other',         label: '💬 General feedback'      },
];

export default function SuggestEditButton() {
  const pathname = usePathname();
  const [open, setOpen]           = useState(false);
  const [category, setCategory]   = useState('other');
  const [body, setBody]           = useState('');
  const [email, setEmail]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setCategory('other');
      setBody('');
      setEmail('');
      setError('');
      setSubmitted(false);
    }, 250);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const text = body.trim();
    if (text.length < 10) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_url:      window.location.href,
          page_title:    document.title,
          category,
          body:          text,
          contact_email: email.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to submit');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Network error — please try again');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* ── Floating pill ── */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-white/12 bg-[#080f1e]/90 px-4 py-2 text-xs font-medium text-slate-400 shadow-xl backdrop-blur-md hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
        aria-label="Suggest an edit to this page"
      >
        <span>✏️</span> Suggest an edit
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* ── Modal ── */}
      {open && (
        <div
          className="fixed z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl shadow-2xl"
          style={{
            bottom: '5rem',
            right: '1.25rem',
            background: '#0c1525',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {submitted ? (
            /* ── Success state ── */
            <div className="px-6 py-8 text-center">
              <p className="text-3xl mb-3">✅</p>
              <p className="font-semibold text-white mb-1">Thanks for your suggestion</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                We review all submissions. Accurate edits are applied within a few days.
                Fair Say NZ stays accurate because people like you speak up.
              </p>
              <button
                onClick={handleClose}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div
                className="flex items-start justify-between gap-3 px-5 pt-5 pb-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Suggest an edit</p>
                  <p className="mt-0.5 text-xs text-slate-500 truncate">{pathname}</p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="shrink-0 text-slate-500 hover:text-white transition-colors text-lg leading-none mt-0.5"
                >
                  ✕
                </button>
              </div>

              <div className="px-5 py-4 space-y-4">
                {/* Category */}
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-2">Type of feedback</p>
                  <div className="space-y-1.5">
                    {CATEGORIES.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCategory(c.value)}
                        className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                          category === c.value
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                            : 'text-slate-400 border-white/7 hover:border-white/18 hover:text-slate-200'
                        }`}
                        style={category !== c.value ? { background: 'rgba(255,255,255,0.03)' } : undefined}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-1.5">
                    Your suggestion
                    <span className="text-slate-600 font-normal ml-1">(min 10 characters)</span>
                  </p>
                  <div className="relative">
                    <textarea
                      value={body}
                      onChange={e => setBody(e.target.value)}
                      maxLength={1000}
                      rows={4}
                      placeholder="What should be changed, corrected, or added?"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-emerald-500/40 transition-colors"
                    />
                    <span className="absolute bottom-2 right-3 text-xs text-slate-600 select-none pointer-events-none">
                      {body.length}/1000
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-1.5">
                    Email
                    <span className="text-slate-600 font-normal ml-1">(optional — for follow-up)</span>
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
                  />
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between gap-3 px-5 pb-5"
              >
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reviewed by the Fair Say NZ team
                </p>
                <button
                  type="submit"
                  disabled={submitting || body.trim().length < 10}
                  className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Sending…' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
