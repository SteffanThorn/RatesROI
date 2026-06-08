'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// Normalise any NZ number input to E.164 (+64XXXXXXXXX)
function normalizeNZPhone(raw) {
  const digits = raw.replace(/[^\d]/g, '');
  if (digits.startsWith('64')) return '+' + digits;
  if (digits.startsWith('0')) return '+64' + digits.slice(1);
  if (digits.length >= 8) return '+64' + digits;
  return null;
}

function isNZMobile(e164) {
  // NZ mobiles: +642x xxxxxxx (9-10 digits after +64)
  return /^\+642\d{7,8}$/.test(e164);
}

const STEPS = { PHONE: 'phone', CODE: 'code', DONE: 'done' };

export default function PhoneAuthForm({ onSuccess }) {
  const [step, setStep] = useState(STEPS.PHONE);
  const [phone, setPhone] = useState('');
  const [normalizedPhone, setNormalizedPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const supabase = createClient();

  async function handleSendOtp(e) {
    e.preventDefault();
    setError('');

    const e164 = normalizeNZPhone(phone);
    if (!e164 || !isNZMobile(e164)) {
      setError('Please enter a valid NZ mobile number (starting with 02).');
      return;
    }

    setLoading(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: e164,
    });
    setLoading(false);

    if (otpError) {
      setError(otpError.message || 'Could not send code. Please try again.');
      return;
    }

    setNormalizedPhone(e164);
    setStep(STEPS.CODE);
    startResendCooldown();
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setError('');

    if (code.length < 6) {
      setError('Enter the 6-digit code from your SMS.');
      return;
    }

    setLoading(true);

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: code,
      type: 'sms',
    });

    if (verifyError) {
      setLoading(false);
      setError(verifyError.message || 'Incorrect code. Please try again.');
      return;
    }

    // Supabase session is now active. Call our server to finalise the account:
    // hash the phone, check for duplicates, create anonymous account record,
    // then strip the phone from auth.users.
    const res = await fetch('/api/account/finalize', { method: 'POST' });
    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      // Duplicate number or server error — sign out and show message
      await supabase.auth.signOut();
      setStep(STEPS.PHONE);
      setCode('');
      setError(result.error || 'Something went wrong. Please try again.');
      return;
    }

    setStep(STEPS.DONE);
    onSuccess?.(result);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setError('');
    setLoading(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
    });
    setLoading(false);
    if (otpError) {
      setError('Could not resend. Please wait a moment and try again.');
    } else {
      startResendCooldown();
    }
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
        <h2 className="text-lg font-semibold text-white mb-1">You're verified</h2>
        <p className="text-sm text-slate-400">Your account is set up. You can now vote in polls.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {step === STEPS.PHONE ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              NZ mobile number
            </label>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-400 select-none">
                +64
              </span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="21 234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 rounded-lg border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
                required
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              NZ numbers only (+64). Your number is never stored.
            </p>
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
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              6-digit code
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Sent to <span className="text-slate-200">{normalizedPhone}</span>
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
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
              onClick={() => { setStep(STEPS.PHONE); setCode(''); setError(''); }}
              className="hover:text-slate-300"
            >
              ← Change number
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
