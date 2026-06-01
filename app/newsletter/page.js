import Link from 'next/link';
import NewsletterSignupForm from '@/components/NewsletterSignupForm';

export const metadata = {
  title: 'Newsletter',
  description: 'Subscribe to the Fair Say NZ objective weekly newsletter.',
};

export default function NewsletterPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
      <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">✉️ Newsletter</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        Subscribe for the weekly Objective Truth edition: multiple-source summaries of contentious NZ civic issues,
        written neutrally and without endorsing any party or politician.
      </p>

      <NewsletterSignupForm />

      <div className="mt-6">
        <Link href="/" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
          ← Back home
        </Link>
      </div>
    </main>
  );
}
