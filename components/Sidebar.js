'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/',           label: 'Home',       icon: '🏠' },
  { href: '/news',       label: 'Grounded News', icon: '📰' },
  { href: '/parties',   label: 'Parties',     icon: '🗳️'  },
  { href: '/mps',        label: 'MPs',         icon: '🏛️' },
  { href: '/civics',     label: 'Civics',      icon: '📚' },
  { href: '/polls',      label: 'Polls',       icon: '📊' },
  { href: '/events',     label: 'Events',      icon: '📅' },
  { href: '/newsletter', label: 'Newsletter',  icon: '✉️'  },
];

function NavLink({ href, label, icon, onClick }) {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
          : 'text-slate-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className="text-base leading-none">{icon}</span>
      {label}
    </Link>
  );
}

export default function Sidebar({ session }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const navContent = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {NAV_LINKS.map((link) => (
        <NavLink key={link.href} {...link} onClick={closeMobile} />
      ))}

      <div className="mt-4 border-t border-white/10 pt-4">
        {session?.user ? (
          <div className="space-y-2">
            <Link
              href="/dashboard"
              onClick={closeMobile}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <span className="text-base leading-none">⚙️</span>
              My Account
            </Link>
            {session.user.role === 'admin' && (
              <Link
                href="/admin"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-amber-300 hover:bg-amber-500/10 transition-colors"
              >
                <span className="text-base leading-none">🛡️</span>
                Admin
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2 px-3">
            <Link
              href="/auth/signin"
              onClick={closeMobile}
              className="block rounded-lg border border-white/15 px-4 py-2 text-center text-sm text-white hover:bg-white/5"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              onClick={closeMobile}
              className="block rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-500"
            >
              Join free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-55 flex-col border-r border-white/8 bg-[#080f1e]/95 backdrop-blur">
        <div className="flex items-center gap-2 border-b border-white/8 px-5 py-4">
          <span className="text-xl">🌿</span>
          <div>
            <p className="text-sm font-bold tracking-wide text-white">Fair Say NZ</p>
            <p className="text-[10px] text-slate-400 leading-tight">Better civic info</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">{navContent}</div>
        <div className="border-t border-white/8 px-5 py-3">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Everyone gets a fair say. · NZ-focused
          </p>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="md:hidden fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-white/8 bg-[#080f1e]/95 px-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌿</span>
          <span className="text-sm font-bold text-white">Fair Say NZ</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-slate-300 hover:bg-white/5"
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <aside className="md:hidden fixed inset-y-0 left-0 z-50 w-72 border-r border-white/8 bg-[#080f1e] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <p className="text-sm font-bold text-white">Fair Say NZ</p>
              </div>
              <button
                type="button"
                onClick={closeMobile}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            {navContent}
          </aside>
        </>
      )}
    </>
  );
}
