'use client';

import { useRouter } from 'next/navigation';
import EmailMagicLinkForm from '@/components/EmailMagicLinkForm';

export default function AuthPage() {
  const router = useRouter();

  function handleSuccess() {
    router.push('/dashboard');
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2">Fair Say NZ</p>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">
            One verified account. One vote per poll. Anonymous once you're in.
          </p>
        </div>

        <div className="card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="text-lg">✉️</span>
            <div>
              <p className="text-sm font-medium text-white">Email verification</p>
              <p className="text-xs text-slate-400">
                Privacy: Low–Medium · Tag:{' '}
                <code className="text-emerald-400 text-xs">email</code>
              </p>
            </div>
          </div>

          <EmailMagicLinkForm onSuccess={handleSuccess} />
        </div>

        <div className="mt-5 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">How anonymity works:</strong> Your email is used
            to verify you're a real person. A one-way fingerprint is stored — not the address
            itself. Your votes cannot be linked back to you.
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <a href="/dashboard" className="text-emerald-400 hover:text-emerald-300">
            Go to dashboard →
          </a>
        </p>
      </div>
    </main>
  );
}
