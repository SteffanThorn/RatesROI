'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

const STEPS = { EMAIL: 'email', OTP: 'otp', DONE: 'done' };

// Collect device fingerprint once, lazily
let fingerprintPromise = null;
function getFingerprint() {
  if (!fingerprintPromise) {
    fingerprintPromise = import('@fingerprintjs/fingerprintjs')
      .then((FingerprintJS) => FingerprintJS.default.load())
      .then((fp) => fp.get())
      .then((result) => result.visitorId)
      .catch(() => 'unknown');
  }
  return fingerprintPromise;
}

export default function EmailMagicLinkForm({ onSuccess }) {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const fingerprintRef = useRef(null);

  // Pre-load fingerprint as soon as the form mounts
  useEffect(() => {
    getFingerprint().then((id) => { fingerprintRef.current = id; });
  }, []);

  const supabase = createClient();

  async function handleSendLink(e) {
    e.preventDefault();
    setError('');

    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    setLoading(true);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        // Send OTP code rather than a click-link, so user stays in the same tab
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (otpError) {
      setError(otpError.message || 'Could not send code. Please try again.');
      return;
    }

    setStep(STEPS.OTP);
    startResendCooldown();
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');

    if (otp.length < 6) {
      setError('Enter the 6-digit code from your email.');
      return;
    }

    setLoading(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: otp,
      type: 'email',
    });

    if (verifyError) {
      setLoading(false);
      setError(verifyError.message || 'Incorrect code. Please try again.');
      return;
    }

    // Session active — finalise the account server-side
    const fingerprint = fingerprintRef.current ?? 'unknown';
    const res = await fetch('/api/account/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint }),
    });

    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      await supabase.auth.signOut();
      setStep(STEPS.EMAIL);
      setOtp('');
      setError(result.error || 'Something went wrong. Please try again.');
      return;
    }

    setStep(STEPS.DONE);
    onSuccess?.(result);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    startResendCooldown();
  }

  function startResendCooldown() {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
  }

  if (step === STEPS.DONE) {
    return (
      <div className="text-center py-6">
        <p className="text-4xl mb-3">✓</p>
        <h2 className="text-lg font-semibold text-white mb-1">You're in</h2>
        <p className="text-sm text-slate-400">Your account is ready. You can now vote in polls.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {step === STEPS.EMAIL ? (
        <form onSubmit={handleSendLink} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
              required
              autoFocus
            />
          </div>

          <div className="rounded-lg border border-blue-500/15 bg-blue-500/5 px-3 py-2.5 text-xs text-blue-200 leading-relaxed">
            💡 <strong>Privacy tip:</strong> Consider using a{' '}
            <a
              href="https://proton.me/mail"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-100"
            >
              Proton Mail address
            </a>
            {' '}— it takes 2 minutes and means your email provider can't see you signed up here.
            Gmail, Outlook, and Yahoo are not recommended.
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send verification code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              6-digit code
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Sent to <span className="text-slate-200">{email}</span>
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white tracking-widest outline-none focus:border-emerald-500/50"
              autoFocus
              required
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {loading ? 'Verifying…' : 'Verify'}
          </button>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={() => { setStep(STEPS.EMAIL); setOtp(''); setError(''); }}
              className="hover:text-slate-300"
            >
              ← Change email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="hover:text-slate-300 disabled:opacity-40"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
