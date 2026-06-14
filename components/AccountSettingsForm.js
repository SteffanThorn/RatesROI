'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// IDKitRequestWidget is a heavy React component — load only when needed
const IDKitRequestWidget = dynamic(
  () => import('@worldcoin/idkit').then((m) => m.IDKitRequestWidget),
  { ssr: false }
);
const orbLegacy = (...a) => import('@worldcoin/idkit').then((m) => m.orbLegacy(...a));

const VERIFY_METHODS = [
  { id: 'ird',             label: 'IRD number',         icon: '🇳🇿' },
  { id: 'ratespayer',      label: 'Ratespayer ID',      icon: '🏡' },
  { id: 'gitcoin_passport', label: 'Gitcoin Passport',  icon: '🛂' },
  { id: 'world_id',        label: 'World ID',           icon: '🌐' },
];

const VERIFIED_LABELS = {
  ird:             'IRD number',
  ratespayer:      'Ratespayer number',
  gitcoin_passport:'Gitcoin Passport',
  world_id:        'World ID',
};

export default function AccountSettingsForm({
  initialElectorate = '',
  initialIsVerified = false,
  initialVerifiedType = null,
}) {
  const [electorate, setElectorate] = useState(initialElectorate);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const [isVerified, setIsVerified] = useState(initialIsVerified);
  const [verifiedType, setVerifiedType] = useState(initialVerifiedType);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState('ird');

  // IRD / Ratespayer
  const [verifyNumber, setVerifyNumber] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  // Gitcoin Passport
  const [ethAddress, setEthAddress] = useState('');
  const [gitcoinVerifying, setGitcoinVerifying] = useState(false);
  const [gitcoinError, setGitcoinError] = useState('');

  // World ID
  const [worldIdOpen, setWorldIdOpen] = useState(false);
  const [worldIdRpContext, setWorldIdRpContext] = useState(null);
  const [worldIdPreset, setWorldIdPreset] = useState(null);
  const [worldIdLoading, setWorldIdLoading] = useState(false);
  const [worldIdError, setWorldIdError] = useState('');
  const worldAppId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID;
  const worldAction = process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || 'verify-voter';

  async function handleElectorate(e) {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const res = await fetch('/api/account/electorate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredElectorate: electorate }),
      });
      setNotice(res.ok ? 'Saved' : 'Could not save');
    } catch {
      setNotice('Network error');
    } finally {
      setSaving(false);
    }
  }

  // ── IRD / Ratespayer ──────────────────────────────────────────────────────

  async function handleIdentityVerify(e) {
    e.preventDefault();
    setVerifying(true);
    setVerifyError('');
    try {
      const res = await fetch('/api/account/verify-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: verifyMethod, number: verifyNumber }),
      });
      const data = await res.json();
      if (!res.ok) { setVerifyError(data.error || 'Verification failed'); return; }
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

  // ── Gitcoin Passport ──────────────────────────────────────────────────────

  async function handleGitcoinVerify(e) {
    e.preventDefault();
    setGitcoinVerifying(true);
    setGitcoinError('');
    try {
      const res = await fetch('/api/account/verify-gitcoin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: ethAddress.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setGitcoinError(data.error || 'Verification failed'); return; }
      setIsVerified(true);
      setVerifiedType(data.verifiedType);
      setShowVerifyForm(false);
      setEthAddress('');
    } catch {
      setGitcoinError('Network error — please try again');
    } finally {
      setGitcoinVerifying(false);
    }
  }

  // ── World ID ──────────────────────────────────────────────────────────────

  async function openWorldId() {
    setWorldIdLoading(true);
    setWorldIdError('');
    try {
      const res = await fetch('/api/account/worldid-session', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) { setWorldIdError(data.error || 'Could not start World ID session'); return; }
      setWorldIdRpContext(data);
      // Dynamically resolve the orbLegacy preset
      const { orbLegacy: orb } = await import('@worldcoin/idkit');
      setWorldIdPreset(orb());
      setWorldIdOpen(true);
    } catch {
      setWorldIdError('Network error — please try again');
    } finally {
      setWorldIdLoading(false);
    }
  }

  async function handleWorldIdSuccess(result) {
    setWorldIdError('');
    // Extract nullifier_hash from the result (v3 or v4 format)
    let nullifier_hash, proof, merkle_root, verification_level;
    if (result?.protocol_version === '3.0') {
      const r = result.responses?.[0];
      nullifier_hash = r?.nullifier_hash;
      proof = r?.proof;
      merkle_root = r?.merkle_root;
      verification_level = r?.credential_type;
    } else if (result?.protocol_version === '4.0') {
      const r = result.responses?.[0];
      nullifier_hash = r?.nullifier_hash;
      proof = r?.proof;
      merkle_root = r?.merkle_root;
      verification_level = r?.verification_level;
    }
    if (!nullifier_hash) {
      setWorldIdError('Proof received but missing nullifier_hash — please try again.');
      return;
    }
    try {
      const res = await fetch('/api/account/verify-worldid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proof, nullifier_hash, merkle_root, verification_level }),
      });
      const data = await res.json();
      if (!res.ok) { setWorldIdError(data.error || 'Verification failed'); return; }
      setIsVerified(true);
      setVerifiedType(data.verifiedType);
      setShowVerifyForm(false);
    } catch {
      setWorldIdError('Network error — please try again');
    }
  }

  function resetVerifyForm() {
    setShowVerifyForm(false);
    setVerifyError('');
    setGitcoinError('');
    setWorldIdError('');
    setVerifyNumber('');
    setEthAddress('');
    setWorldIdOpen(false);
    setWorldIdRpContext(null);
    setWorldIdPreset(null);
  }

  const verifiedLabel = VERIFIED_LABELS[verifiedType] ?? verifiedType;

  return (
    <div className="mt-5 space-y-6">

      {/* Electorate preference */}
      <form onSubmit={handleElectorate} className="flex flex-wrap items-end gap-3">
        <label className="min-w-50 flex-1">
          <span className="mb-1 block text-sm text-slate-400">Preferred electorate</span>
          <input
            type="text"
            placeholder="e.g. Ilam, Wellington Central, Tāmaki"
            value={electorate}
            onChange={(e) => setElectorate(e.target.value)}
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
              Required to participate in polls. Your details are never stored — only a one-way hash.
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
          <div className="mt-4 space-y-4">

            {/* Method tabs */}
            <div className="flex flex-wrap gap-2">
              {VERIFY_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setVerifyMethod(m.id);
                    setVerifyError('');
                    setGitcoinError('');
                    setWorldIdError('');
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    verifyMethod === m.id
                      ? 'bg-emerald-600 text-white'
                      : 'border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>

            {/* ── IRD / Ratespayer ── */}
            {(verifyMethod === 'ird' || verifyMethod === 'ratespayer') && (
              <form onSubmit={handleIdentityVerify} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-400">
                    {verifyMethod === 'ird' ? 'IRD number (8 or 9 digits)' : 'Ratespayer number'}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={verifyMethod === 'ird' ? '123-456-789' : 'Your council ratespayer ID'}
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
                  <button type="button" onClick={resetVerifyForm}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 hover:text-white">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* ── Gitcoin Passport ── */}
            {verifyMethod === 'gitcoin_passport' && (
              <form onSubmit={handleGitcoinVerify} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-400">
                    Ethereum wallet address (must have a Passport at passport.xyz)
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={ethAddress}
                    onChange={(e) => setEthAddress(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-emerald-500/50"
                    required
                  />
                </div>
                <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-xs text-violet-200 leading-relaxed">
                  <strong className="block mb-0.5">What is Gitcoin Passport?</strong>
                  Gitcoin Passport lets you prove you're a real person using privacy-preserving web3 credentials —
                  without revealing your identity. Your wallet address is hashed and never stored.{' '}
                  <a href="https://passport.xyz" target="_blank" rel="noopener noreferrer"
                    className="underline hover:text-white">Create your Passport →</a>
                </div>
                {gitcoinError ? <p className="text-xs text-red-400">{gitcoinError}</p> : null}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={gitcoinVerifying || !ethAddress.trim()}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
                  >
                    {gitcoinVerifying ? 'Checking…' : 'Verify with Gitcoin'}
                  </button>
                  <button type="button" onClick={resetVerifyForm}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 hover:text-white">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* ── World ID ── */}
            {verifyMethod === 'world_id' && (
              <div className="space-y-3">
                <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-xs text-indigo-200 leading-relaxed">
                  <strong className="block mb-0.5">What is World ID?</strong>
                  World ID uses iris biometrics via Worldcoin's orb to prove you're a unique human,
                  without revealing who you are. Your identity is never stored — only a cryptographic proof.{' '}
                  <a href="https://worldcoin.org/world-id" target="_blank" rel="noopener noreferrer"
                    className="underline hover:text-white">Learn more →</a>
                </div>

                {worldIdError ? <p className="text-xs text-red-400">{worldIdError}</p> : null}

                {/* Render the IDKit widget only once we have a session */}
                {worldAppId && worldIdRpContext && worldIdPreset ? (
                  <IDKitRequestWidget
                    open={worldIdOpen}
                    onOpenChange={setWorldIdOpen}
                    app_id={worldAppId}
                    action={worldAction}
                    rp_context={worldIdRpContext}
                    preset={worldIdPreset}
                    allow_legacy_proofs={true}
                    onSuccess={handleWorldIdSuccess}
                    onError={(err) => setWorldIdError(typeof err === 'string' ? err : (err?.message ?? 'World ID error'))}
                  />
                ) : null}

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={worldIdLoading}
                    onClick={openWorldId}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
                  >
                    {worldIdLoading ? 'Opening World ID…' : 'Verify with World ID'}
                  </button>
                  <button type="button" onClick={resetVerifyForm}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 hover:text-white">
                    Cancel
                  </button>
                </div>
              </div>
            )}

          </div>
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
