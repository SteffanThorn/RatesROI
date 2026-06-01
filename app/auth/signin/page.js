import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';

export default function SignInPage({ searchParams }) {
  async function authenticate(formData) {
    'use server';

    try {
      await signIn('credentials', {
        email: String(formData.get('email') || ''),
        password: String(formData.get('password') || ''),
        redirectTo: '/dashboard',
      });
    } catch {
      redirect('/auth/signin?error=Invalid%20email%20or%20password');
    }
  }

  const error = searchParams?.error || '';
  const created = searchParams?.created === '1';

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-16">
      <form action={authenticate} className="card w-full rounded-3xl p-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2">Fair Say NZ</p>
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-slate-300">Access your civic account.</p>
        {created ? <p className="mt-3 text-sm text-emerald-300">Account created. Please sign in.</p> : null}
        <div className="mt-6 space-y-4">
          <input type="email" name="email" placeholder="Email" className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" required />
          <input type="password" name="password" placeholder="Password" className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none" required />
        </div>
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        <button type="submit" className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-500">
          Sign in
        </button>
        <p className="mt-4 text-sm text-slate-300">
          Need an account? <Link href="/auth/signup" className="text-cyan-300 hover:underline">Create one</Link>
        </p>
      </form>
    </main>
  );
}
