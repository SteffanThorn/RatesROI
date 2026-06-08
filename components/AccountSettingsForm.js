'use client';

import { useState } from 'react';

export default function AccountSettingsForm({
  initialElectorate = '',
  initialIsVerified = false,
  initialVerifiedType = null,
}) {
  const [electorate, setElectorate] = useState(initialElectorate);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  // Identity verification state
  const [isVerified, setIsVerified] = useState(initialIsVerified);
  const [verifiedType, setVerifiedType] = useState(initialVerifiedType);
  const [verifyType, setVerifyType] = useState('ird');
  const [verifyNumber, setVerifyNumber] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [showVerifyForm, setShowVerifyForm] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice('');

    try {
      const response = await fetch('/api/account/electorate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredElectorate: electorate }),
      });

      if (!response.ok) {
        setNotice('Could not save');
        return;
      }

      setNotice('Saved');
    } catch {
      setNotice('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function handleVerify(event) {
    event.preventDefault();
    setVerifying(true);
    setVerifyError('');

    try {
      const response = await fetch('/api/account/verify-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: verifyType, number: verifyNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        setVerifyError(data.error || 'Verification failed');
        return;
      }

      setIsVerified(true);
      setVerifiedType(data.verifiedType);
      setShowVerifyForm(false);
      setVerifyNumber('');
    } catch {
      setVerifyError('Network error — please try again');
    } finally {
      setVerifying(false);
    }
  }

  const verifiedLabel = verifiedType === 'ird' ? 'IRD number' : 'Ratespayer number';

  return (
    <div className="mt-5 space-y-6">
      {/* Electorate preference */}
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <label className="min-w-50 flex-1">
          <span className="mb-1 block text-sm text-slate-400">Preferred electorate</span>
          <input
            type="text"
            placeholder="e.g. Ilam, Wellington Central, Tāmaki"
            value={electorate}
            onChange={(event) => setElectorate(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {notice ? <p className="text-sm text-emerald-300">{notice}</p> : null}
      </form>

      {/* Identity verification */}
      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Voter Verification</h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Required to participate in polls. Your number is never stored — only a one-way hash.
            </p>
          </div>
          {isVerified ? (
            <span className="mt-0.5 shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
              Verified
            </span>
          ) : (
            <span className="mt-0.5 shrink-0 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-300">
              Unverified
            </span>
          )}
        </div>

        {isVerified ? (
          <p className="mt-3 text-xs text-slate-400">
            Verified via <span className="text-slate-200">{verifiedLabel}</span>. You can vote in all Fair Say NZ polls.
          </p>
        ) : showVerifyForm ? (
          <form onSubmit={handleVerify} className="mt-4 space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVerifyType('ird')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  verifyType === 'ird'
                    ? 'bg-emerald-600 text-white'
                    : 'border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                IRD number
              </button>
              <button
                type="button"
                onClick={() => setVerifyType('ratespayer')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  verifyType === 'ratespayer'
                    ? 'bg-emerald-600 text-white'
                    : 'border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Ratespayer number
              </button>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400">
                {verifyType === 'ird' ? 'IRD number (8 or 9 digits)' : 'Ratespayer number'}
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder={verifyType === 'ird' ? '123-456-789' : 'Your council ratespayer ID'}
                value={verifyNumber}
                onChange={(e) => setVerifyNumber(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
                required
              />
            </div>

            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2 text-xs text-blue-200 leading-relaxed">
              Your number is hashed on our server before any data is saved. The original number is never stored.
              Each number can only be used once across the platform.
            </div>

            {verifyError ? <p className="text-xs text-red-400">{verifyError}</p> : null}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={verifying || !verifyNumber.trim()}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {verifying ? 'Verifying…' : 'Verify'}
              </button>
              <button
                type="button"
                onClick={() => { setShowVerifyForm(false); setVerifyError(''); setVerifyNumber(''); }}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowVerifyForm(true)}
            className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Verify my identity →
          </button>
        )}
      </div>
    </div>
  );
}
