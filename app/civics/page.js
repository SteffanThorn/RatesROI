import Link from 'next/link';

export const metadata = {
  title: 'Civics',
  description: 'How NZ government works, MMP explained, how laws are made, and real ways to have your say.',
};

/* ── Diagram: NZ Government Structure ─────────────────────────────────────── */
function GovernmentDiagram() {
  return (
    <div className="mb-6 rounded-2xl overflow-hidden" style={{ background: 'rgba(8,15,30,0.88)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-5 pt-5 pb-2">
        <p className="text-xs uppercase tracking-widest text-emerald-400 mb-1">Visual overview</p>
        <p className="text-xs text-slate-500">How the three branches relate to each other</p>
      </div>
      <svg viewBox="0 0 660 400" className="w-full" aria-label="Diagram of NZ Government structure">
        {/* ── Crown ── */}
        <rect x="230" y="18" width="200" height="52" rx="10" fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.45)" strokeWidth="1.5"/>
        <text x="330" y="38" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="700">👑 THE CROWN</text>
        <text x="330" y="58" textAnchor="middle" fill="#94a3b8" fontSize="10">King Charles III · constitutional monarchy</text>

        {/* Crown → GG */}
        <line x1="330" y1="70" x2="330" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4,3"/>
        <polygon points="326,100 334,100 330,108" fill="rgba(255,255,255,0.2)"/>

        {/* ── Governor-General ── */}
        <rect x="200" y="108" width="260" height="52" rx="10" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5"/>
        <text x="330" y="128" textAnchor="middle" fill="#c4b5fd" fontSize="12" fontWeight="700">🏅 GOVERNOR-GENERAL</text>
        <text x="330" y="147" textAnchor="middle" fill="#94a3b8" fontSize="10">King's representative · gives Royal Assent to laws</text>

        {/* GG → Parliament */}
        <line x1="330" y1="160" x2="330" y2="190" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4,3"/>
        <polygon points="326,190 334,190 330,198" fill="rgba(255,255,255,0.2)"/>

        {/* ── Parliament ── */}
        <rect x="170" y="198" width="320" height="52" rx="10" fill="rgba(16,185,129,0.13)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5"/>
        <text x="330" y="218" textAnchor="middle" fill="#6ee7b7" fontSize="12" fontWeight="700">🏛️ PARLIAMENT — 120 MPs</text>
        <text x="330" y="237" textAnchor="middle" fill="#94a3b8" fontSize="10">Passes laws · approves spending · holds govt to account</text>

        {/* Parliament → three branches */}
        <line x1="220" y1="250" x2="100" y2="300" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
        <line x1="330" y1="250" x2="330" y2="300" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
        <line x1="440" y1="250" x2="560" y2="300" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>

        {/* ── Executive (Cabinet) ── */}
        <rect x="10" y="300" width="190" height="72" rx="10" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.35)" strokeWidth="1.5"/>
        <text x="105" y="320" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="700">⚙️ EXECUTIVE</text>
        <text x="105" y="337" textAnchor="middle" fill="#94a3b8" fontSize="9.5">Prime Minister + Cabinet</text>
        <text x="105" y="352" textAnchor="middle" fill="#94a3b8" fontSize="9.5">Run day-to-day government</text>
        <text x="105" y="365" textAnchor="middle" fill="#94a3b8" fontSize="9.5">Must keep Parliament's confidence</text>

        {/* ── Local Government ── */}
        <rect x="235" y="300" width="190" height="72" rx="10" fill="rgba(16,185,129,0.09)" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5"/>
        <text x="330" y="320" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="700">🏘️ LOCAL GOVT</text>
        <text x="330" y="337" textAnchor="middle" fill="#94a3b8" fontSize="9.5">78 councils · elected every 3 yrs</text>
        <text x="330" y="352" textAnchor="middle" fill="#94a3b8" fontSize="9.5">Planning · water · roads · rates</text>
        <text x="330" y="365" textAnchor="middle" fill="#94a3b8" fontSize="9.5">Separate from central govt</text>

        {/* ── Judiciary ── */}
        <rect x="460" y="300" width="190" height="72" rx="10" fill="rgba(168,85,247,0.12)" stroke="rgba(168,85,247,0.35)" strokeWidth="1.5"/>
        <text x="555" y="320" textAnchor="middle" fill="#d8b4fe" fontSize="11" fontWeight="700">⚖️ JUDICIARY</text>
        <text x="555" y="337" textAnchor="middle" fill="#94a3b8" fontSize="9.5">District → High Court</text>
        <text x="555" y="352" textAnchor="middle" fill="#94a3b8" fontSize="9.5">Court of Appeal</text>
        <text x="555" y="365" textAnchor="middle" fill="#94a3b8" fontSize="9.5">→ Supreme Court (top)</text>
      </svg>
      <p className="px-5 pb-4 text-xs text-slate-600 text-center">Dashed lines = appoints / advises. Solid lines = democratic accountability.</p>
    </div>
  );
}

/* ── Diagram: MMP Ballot ──────────────────────────────────────────────────── */
function MMPDiagram() {
  const parties = [
    { name: 'National', color: '#1a56a4', pct: 38, seats: 49 },
    { name: 'Labour',   color: '#cc0000', pct: 27, seats: 34 },
    { name: 'Green',    color: '#098137', pct: 12, seats: 15 },
    { name: 'ACT',      color: '#d4a017', pct: 9,  seats: 11 },
    { name: 'NZ First', color: '#4b5563', pct: 6,  seats: 8  },
    { name: 'Māori',    color: '#b5281e', pct: 3,  seats: 6  },
    { name: 'Below 5%', color: '#374151', pct: 5,  seats: 0, below: true },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2">
      {/* Ballot paper */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(8,15,30,0.88)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="bg-slate-800/60 px-4 py-3 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-bold text-white uppercase tracking-widest">Official Ballot Paper</p>
          <p className="text-xs text-slate-500 mt-0.5">NZ General Election · 2 votes per person</p>
        </div>
        <div className="grid grid-cols-2" style={{ divideColor: 'rgba(255,255,255,0.08)' }}>
          <div className="p-4" style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#fbbf24' }}>Electorate Vote</p>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Picks your local MP directly</p>
            {['Alice Chen', 'Bob Tāmaki', 'Sarah Williams ✓', 'David Ngāpō'].map((name) => {
              const sel = name.includes('✓');
              return (
                <div key={name} className="flex items-center gap-2 mb-2.5">
                  <div className="h-4 w-4 rounded-full shrink-0 flex items-center justify-center"
                    style={{ border: `2px solid ${sel ? '#fbbf24' : 'rgba(255,255,255,0.2)'}`, background: sel ? '#fbbf24' : 'transparent' }}>
                    {sel && <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />}
                  </div>
                  <span className="text-xs" style={{ color: sel ? '#fbbf24' : '#94a3b8' }}>{name.replace(' ✓', '')}</span>
                </div>
              );
            })}
          </div>
          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider mb-0.5 text-emerald-400">Party Vote</p>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Shapes Parliament's makeup — most powerful</p>
            {['National Party', 'Labour Party', 'Green Party ✓', 'ACT Party'].map((name) => {
              const sel = name.includes('✓');
              return (
                <div key={name} className="flex items-center gap-2 mb-2.5">
                  <div className="h-4 w-4 rounded-full shrink-0 flex items-center justify-center"
                    style={{ border: `2px solid ${sel ? '#10b981' : 'rgba(255,255,255,0.2)'}`, background: sel ? '#10b981' : 'transparent' }}>
                    {sel && <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />}
                  </div>
                  <span className="text-xs" style={{ color: sel ? '#10b981' : '#94a3b8' }}>{name.replace(' ✓', '')}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(16,185,129,0.05)' }}>
          <p className="text-xs text-emerald-300 text-center">💡 Your party vote matters more for shaping Parliament</p>
        </div>
      </div>

      {/* Seat allocation */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(8,15,30,0.88)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Party Vote → Seats (120 total)</p>
        <p className="text-xs text-slate-500 mb-5">Parties below 5% get no seats unless they win an electorate</p>
        <div className="space-y-3">
          {parties.map((p) => (
            <div key={p.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: p.below ? '#4b5563' : '#cbd5e1' }}>{p.name}</span>
                <span className="text-xs font-mono" style={{ color: p.below ? '#4b5563' : p.color }}>
                  {p.below ? '0 seats ✗' : `${p.seats} seats`}
                </span>
              </div>
              <div className="h-4 rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${p.pct}%`, background: p.color, opacity: p.below ? 0.25 : 0.85 }}
                />
                {p.below && (
                  <div className="absolute inset-y-0 flex items-center" style={{ left: '5%' }}>
                    <div className="w-px h-full" style={{ background: 'rgba(239,68,68,0.6)' }} />
                    <span className="text-xs text-red-400 ml-1 whitespace-nowrap">← 5% threshold</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Diagram: Parliament Hemicycle ───────────────────────────────────────── */
function ParliamentHemicycle() {
  // Ordered left → right across the chamber
  const parties = [
    { name: 'Te Pāti Māori', short: 'TPM', color: '#b5281e', seats: 6  },
    { name: 'Green Party',   short: 'GRN', color: '#098137', seats: 15 },
    { name: 'Labour',        short: 'LAB', color: '#cc0000', seats: 34 },
    { name: 'NZ First',      short: 'NZF', color: '#4b5563', seats: 8  },
    { name: 'National',      short: 'NAT', color: '#1a56a4', seats: 49 },
    { name: 'ACT',           short: 'ACT', color: '#d4a017', seats: 11 },
  ];

  const total = parties.reduce((s, p) => s + p.seats, 0); // 123

  // Flat list of colours in left→right order
  const seatColors = parties.flatMap(p => Array(p.seats).fill(p.color));

  // 5 concentric rows — innermost to outermost, totalling 123
  const rows = [
    { n: 17, r: 98  },
    { n: 21, r: 130 },
    { n: 25, r: 162 },
    { n: 29, r: 194 },
    { n: 31, r: 226 },
  ];

  const cx = 250, cy = 268;

  // Generate every dot position across all rows
  const allDots = [];
  for (const { n, r } of rows) {
    for (let i = 0; i < n; i++) {
      const angle = Math.PI - (i / (n - 1)) * Math.PI;
      allDots.push({
        x: +(cx + r * Math.cos(angle)).toFixed(1),
        y: +(cy - r * Math.sin(angle)).toFixed(1),
        angle,
      });
    }
  }

  // Sort by angle descending (π = far left → 0 = far right) so each party
  // occupies a contiguous vertical wedge rather than diagonal stripes
  allDots.sort((a, b) => b.angle - a.angle);
  const dots = allDots.map((d, i) => ({ ...d, color: seatColors[i] }));

  return (
    <div className="mb-6 rounded-2xl p-5" style={{ background: 'rgba(8,15,30,0.88)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="text-xs uppercase tracking-widest text-emerald-400 mb-0.5">Current House composition</p>
      <p className="text-xs text-slate-500 mb-3">2023 election result · seats arranged left → right across the chamber</p>

      <svg viewBox="0 0 500 285" className="w-full" aria-label="NZ Parliament hemicycle — 2023 seat distribution by party">
        {/* Faint background arc */}
        <path
          d={`M ${cx - 242} ${cy} A 242 242 0 0 1 ${cx + 242} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"
        />
        {/* Seat dots */}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="6.5" fill={d.color} opacity="0.92" />
        ))}
        {/* Centre count */}
        <text x={cx} y={cy - 18} textAnchor="middle" fill="white" fontSize="30" fontWeight="800">{total}</text>
        <text x={cx} y={cy - 2}  textAnchor="middle" fill="#475569" fontSize="10" letterSpacing="1">SEATS</text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center mt-1">
        {parties.map(p => (
          <div key={p.short} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
            <span className="text-xs font-medium text-slate-300">{p.short}</span>
            <span className="text-xs text-slate-500">{p.seats}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Diagram: Law Making Pipeline ────────────────────────────────────────── */
const LAW_STEPS = [
  {
    n: 1, icon: '📄', label: 'Introduction & First Reading',
    who: 'Any MP or Minister',
    colour: '#6366f1',
    desc: 'A bill (proposed law) is introduced in Parliament. MPs vote to progress it — this is usually a formality. A brief debate outlines what the bill does and why it\'s needed.',
    tip: null,
  },
  {
    n: 2, icon: '🔍', label: 'Select Committee',
    who: 'Committee of MPs + the public',
    colour: '#0891b2',
    desc: 'The bill is sent to a specialist committee of MPs. The committee calls for public submissions — any NZ resident can write in. Submissions are read, and MPs can call submitters in person. This is your most direct chance to shape legislation.',
    tip: { label: 'Make a submission ↗', href: 'https://www.parliament.nz/en/pb/sc/make-a-submission/' },
  },
  {
    n: 3, icon: '💬', label: 'Second Reading',
    who: 'All MPs debate',
    colour: '#059669',
    desc: 'Parliament debates the select committee\'s report and its recommendations. MPs vote on the principles of the bill — is this the right direction? Amendments from the committee are considered.',
    tip: null,
  },
  {
    n: 4, icon: '✏️', label: 'Committee of the Whole House',
    who: 'All MPs, clause by clause',
    colour: '#d97706',
    desc: 'Every MP sits as a committee and goes through the bill line by line. This is where detailed changes happen — individual clauses can be amended, removed, or added. Often the most time-consuming stage.',
    tip: null,
  },
  {
    n: 5, icon: '🗳️', label: 'Third Reading',
    who: 'Final debate and vote',
    colour: '#dc2626',
    desc: 'A final debate on the bill as amended. MPs vote yes or no. If it passes, the bill is sent to the Governor-General. If it fails, the bill falls and the process must start again.',
    tip: null,
  },
  {
    n: 6, icon: '👑', label: 'Royal Assent',
    who: 'Governor-General',
    colour: '#9333ea',
    desc: 'The Governor-General signs the bill on the advice of the Prime Minister. It becomes an Act of Parliament — the law of the land. Most Acts come into force immediately; some specify a future date.',
    tip: null,
  },
];

function LawDiagram() {
  return (
    <div className="mb-6 rounded-2xl p-6" style={{ background: 'rgba(8,15,30,0.88)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg px-3 py-1.5 text-xs font-bold" style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
          BILL
        </div>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(99,102,241,0.4), rgba(147,51,234,0.4))' }} />
        <div className="rounded-lg px-3 py-1.5 text-xs font-bold" style={{ background: 'rgba(147,51,234,0.15)', color: '#d8b4fe', border: '1px solid rgba(147,51,234,0.3)' }}>
          ACT OF PARLIAMENT
        </div>
      </div>

      <div className="space-y-0">
        {LAW_STEPS.map((step, i) => (
          <div key={step.n} className="flex gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold shrink-0"
                style={{ background: `${step.colour}22`, border: `2px solid ${step.colour}55`, color: step.colour }}
              >
                {step.icon}
              </div>
              {i < LAW_STEPS.length - 1 && (
                <div className="my-1 w-px flex-1" style={{ background: `${step.colour}30`, minHeight: '24px' }} />
              )}
            </div>
            <div className="pb-6 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="font-semibold text-white text-sm">{step.label}</p>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${step.colour}18`, color: `${step.colour}cc` }}>
                  {step.who}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{step.desc}</p>
              {step.tip && (
                <a
                  href={step.tip.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300"
                >
                  {step.tip.label}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Diagram: Rights Overview ─────────────────────────────────────────────── */
const RIGHTS_VISUAL = [
  { icon: '🗣️', label: 'Free speech', act: 'BORA 1990' },
  { icon: '🙏', label: 'Religion', act: 'BORA 1990' },
  { icon: '🗳️', label: 'Vote', act: 'BORA 1990' },
  { icon: '⚖️', label: 'Fair trial', act: 'BORA 1990' },
  { icon: '🛡️', label: 'No discrimination', act: 'HRA 1993' },
  { icon: '🔒', label: 'Privacy', act: 'Privacy Act 2020' },
  { icon: '📂', label: 'Access to info', act: 'OIA 1982' },
  { icon: '👥', label: 'Association', act: 'BORA 1990' },
];

function RightsDiagram() {
  return (
    <div className="mb-6 rounded-2xl p-5" style={{ background: 'rgba(8,15,30,0.88)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="text-xs uppercase tracking-widest text-emerald-400 mb-4">Rights at a glance</p>
      <div className="grid grid-cols-4 gap-3">
        {RIGHTS_VISUAL.map((r) => (
          <div key={r.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-2xl mb-1.5">{r.icon}</div>
            <p className="text-xs font-semibold text-white mb-0.5">{r.label}</p>
            <p className="text-xs text-slate-500">{r.act}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-600 text-center">These rights apply to everyone in NZ — citizens and non-citizens alike</p>
    </div>
  );
}

/* ── Participation actions ────────────────────────────────────────────────── */
const ACTIONS = [
  {
    icon: '📝',
    title: 'Make a select committee submission',
    difficulty: 'Easy', time: '30–60 min', impact: 'High',
    diffColor: '#10b981', impactColor: '#10b981',
    desc: 'When Parliament considers a bill, any NZ resident can write in — even just a few sentences counts. Your submission is read by MPs and can directly change the law. At Step 2 of law-making, this is where public voices most influence legislation.',
    link: { label: 'Find open submissions ↗', href: 'https://www.parliament.nz/en/pb/sc/make-a-submission/' },
  },
  {
    icon: '📬',
    title: 'Contact your MP',
    difficulty: 'Easy', time: '5–15 min', impact: 'Medium',
    diffColor: '#10b981', impactColor: '#f59e0b',
    desc: 'Email or call your electorate MP about an issue — they are required to respond to constituents. A personalised email carries more weight than a petition signature. Find contact details on the MPs page.',
    link: null,
  },
  {
    icon: '🔎',
    title: 'File an OIA request',
    difficulty: 'Easy', time: '5 min', impact: 'Medium',
    diffColor: '#10b981', impactColor: '#f59e0b',
    desc: 'Under the Official Information Act, you can request any information held by government agencies. Agencies must respond within 20 working days. Use fyi.org.nz to submit and track requests publicly — transparency is a right, not a favour.',
    link: { label: 'fyi.org.nz ↗', href: 'https://fyi.org.nz' },
  },
  {
    icon: '✍️',
    title: 'Sign or start a parliamentary petition',
    difficulty: 'Easy', time: '2–30 min', impact: 'Medium',
    diffColor: '#10b981', impactColor: '#f59e0b',
    desc: 'A petition with enough signatures is formally debated in Parliament. Any NZ resident can create one at parliament.nz. Petitions with large numbers of signatories receive a formal government response and can trigger a select committee inquiry.',
    link: null,
  },
  {
    icon: '🏢',
    title: 'Attend your local council meeting',
    difficulty: 'Medium', time: '2–3 hours', impact: 'High (local)',
    diffColor: '#f59e0b', impactColor: '#10b981',
    desc: 'Council meetings are open to the public — you can speak during public participation sessions. This is especially powerful for local planning, rates, and infrastructure decisions. Councils are often more responsive than Parliament because the community is smaller.',
    link: null,
  },
  {
    icon: '🏅',
    title: 'Stand as a candidate',
    difficulty: 'Hard', time: 'Months', impact: 'Very High',
    diffColor: '#dc2626', impactColor: '#10b981',
    desc: 'Any eligible NZ voter can stand for Parliament or local council. Local council is far more accessible — smaller campaigns, lower costs, and direct community impact. Being elected is not the only outcome; candidacy builds movements and platforms.',
    link: null,
  },
];

function Badge({ label, color }) {
  return (
    <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: `${color}20`, color: `${color}dd`, border: `1px solid ${color}40` }}>
      {label}
    </span>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function CivicsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">📚 Civics</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          How New Zealand government works — explained plainly, with visuals, and without party spin.
          Understanding the system is the first step to shaping it.
        </p>
      </header>

      {/* Jump links */}
      <nav className="mb-10 flex flex-wrap gap-2">
        {[
          { id: 'government', label: '🏛️ How Govt Works' },
          { id: 'mmp',        label: '🗳️ MMP Explained' },
          { id: 'lawmaking',  label: '📜 How Laws Are Made' },
          { id: 'influence',  label: '📣 Have Your Say' },
          { id: 'rights',     label: '⚖️ Your Rights' },
        ].map((s) => (
          <a key={s.id} href={`#${s.id}`}
            className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors">
            {s.label}
          </a>
        ))}
      </nav>

      <div className="space-y-14">

        {/* ── How NZ Government Works ── */}
        <section id="government" className="scroll-mt-20">
          <h2 className="mb-2 text-xl font-bold text-white">🏛️ How NZ Government Works</h2>
          <p className="mb-6 text-sm text-slate-400 max-w-2xl">
            New Zealand is a constitutional monarchy and parliamentary democracy. Power flows from the Crown through Parliament, splitting into three branches that check each other.
          </p>
          <GovernmentDiagram />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                heading: 'Parliament — the law-maker',
                color: '#10b981',
                body: 'New Zealand has a unicameral (single-chamber) Parliament with 120 seats. Unlike most democracies there is no upper house or Senate — one chamber passes all laws. MPs debate bills, approve the government\'s budget, and question Ministers in Question Time. Parliament sits in Wellington and is elected every three years.',
              },
              {
                heading: 'The Executive — the decision-maker',
                color: '#3b82f6',
                body: 'The Prime Minister and Cabinet Ministers run the government day-to-day: setting policy, directing departments, and spending the budget Parliament approves. Cabinet is collectively responsible to Parliament — if Parliament passes a no-confidence vote, the government must resign or call an election.',
              },
              {
                heading: 'The Governor-General — the constitutional guardian',
                color: '#8b5cf6',
                body: "The Governor-General is the King's representative in NZ, appointed on the PM's advice for a 5-year term. They give Royal Assent to turn bills into law, open Parliament, and — in an extreme constitutional crisis — could refuse to sign a bill. In practice the role is largely ceremonial, but the power exists as a safeguard.",
              },
              {
                heading: 'The Courts — the rule-enforcer',
                color: '#9333ea',
                body: 'The judiciary (District Courts → High Court → Court of Appeal → Supreme Court) interprets and applies the law independently of Parliament and the executive. Courts can declare that government actions violate the NZ Bill of Rights Act, though Parliament retains the final say and can override such decisions by passing new laws.',
              },
              {
                heading: 'Local Government — the closest to you',
                color: '#059669',
                body: 'NZ has 78 councils: 11 regional councils (environment, transport, civil defence) and 67 territorial authorities (city and district councils). Local elections are held every three years by postal vote. Councils control what you see every day — planning rules, footpaths, rubbish, water, and rates. Many people find local government more accessible than Parliament.',
              },
              {
                heading: 'The Public Service — the deliverers',
                color: '#0891b2',
                body: 'Around 55,000 public servants work in government departments (Treasury, MSD, MBIE, etc.), implementing the policies Ministers decide. They are politically neutral — they serve the government of the day, regardless of party. Their work ranges from processing benefits to running hospitals to negotiating trade deals.',
              },
            ].map((item) => (
              <div key={item.heading} className="card rounded-2xl p-5" style={{ borderTop: `3px solid ${item.color}40` }}>
                <h3 className="mb-2 font-semibold text-sm" style={{ color: item.color }}>{item.heading}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── MMP ── */}
        <section id="mmp" className="scroll-mt-20">
          <h2 className="mb-2 text-xl font-bold text-white">🗳️ MMP Explained</h2>
          <p className="mb-6 text-sm text-slate-400 max-w-2xl">
            Mixed-Member Proportional (MMP) is NZ's voting system since 1996. It gives every voter two votes: one for a local MP, one for a party. The party vote determines how Parliament is composed.
          </p>
          <MMPDiagram />
          <ParliamentHemicycle />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                heading: 'Two votes, very different effects',
                color: '#f59e0b',
                body: 'Your electorate vote elects one person from your local area — the candidate with the most votes wins regardless of party. Your party vote is tallied nationally and determines how many seats each party gets across Parliament\'s 120 seats. The party vote is almost always more powerful for shaping the overall outcome.',
              },
              {
                heading: 'The 5% threshold',
                color: '#ef4444',
                body: 'A party must win at least 5% of the total party vote nationwide, OR win at least one electorate seat, to enter Parliament and receive seats proportional to their vote. This prevents extreme fragmentation — dozens of tiny parties each holding one or two seats — while still allowing small parties a realistic path in via electorate seats.',
              },
              {
                heading: 'The coattail rule',
                color: '#8b5cf6',
                body: 'If a party wins an electorate seat, they can bring in additional List MPs proportional to their overall party vote — even if that vote is below 5%. This "coattail" or "one-seat lifeboat" rule means a popular local candidate can carry a whole party into Parliament. It\'s controversial and under regular review.',
              },
              {
                heading: 'Overhang seats',
                color: '#0891b2',
                body: 'If a party wins more electorate seats than their party vote entitles them to — for example, winning 7 electorates on 3% of the party vote — Parliament temporarily expands beyond 120 to accommodate them. These extra seats are called overhang seats. Te Pāti Māori has caused overhangs in recent elections.',
              },
              {
                heading: 'List MPs vs Electorate MPs',
                color: '#10b981',
                body: 'Electorate MPs are directly elected in a geographic seat — voters in Botany, say, choose their MP. List MPs fill remaining seats so the total composition reflects each party\'s party vote share. Parties rank their candidates on a list before the election; if a party wins 40 seats but only 20 electorate seats, the top 20 List candidates fill the rest. Both types have exactly equal voting rights in Parliament.',
              },
              {
                heading: 'Why your party vote matters most',
                color: '#6366f1',
                body: 'In most electorates, one of the two major parties is almost certain to win — your electorate vote often won\'t change that outcome. But your party vote goes into a national pool that is directly proportional: every vote counts equally regardless of where you live. Voting for a smaller party in the party vote can meaningfully change Parliament\'s balance of power.',
              },
            ].map((item) => (
              <div key={item.heading} className="card rounded-2xl p-5" style={{ borderTop: `3px solid ${item.color}40` }}>
                <h3 className="mb-2 font-semibold text-sm" style={{ color: item.color }}>{item.heading}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 px-5 py-4">
            <p className="text-xs text-blue-200 leading-relaxed">
              <strong>Key insight:</strong> If you support a small party, give them your party vote — even if you vote for a different candidate in your electorate. The party vote is what keeps smaller parties in Parliament and maintains a diverse range of voices in the chamber.
            </p>
          </div>
        </section>

        {/* ── How Laws Are Made ── */}
        <section id="lawmaking" className="scroll-mt-20">
          <h2 className="mb-2 text-xl font-bold text-white">📜 How Laws Are Made</h2>
          <p className="mb-6 text-sm text-slate-400 max-w-2xl">
            A law begins as a "bill" — a proposal written in legal language. It must pass through six stages before it becomes binding law. At Step 2, any New Zealander can have their say.
          </p>
          <LawDiagram />
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
            <p className="text-xs text-emerald-200 leading-relaxed">
              <strong>Where citizens have the most power:</strong> The Select Committee stage (Step 2) is when public submissions are accepted. You don't need to be an expert — a personal, genuine account of how a proposed law affects you or your community carries real weight. The committee's report often directly shapes the final law.
            </p>
          </div>
        </section>

        {/* ── Have Your Say ── */}
        <section id="influence" className="scroll-mt-20">
          <h2 className="mb-2 text-xl font-bold text-white">📣 Real Ways to Have Your Say</h2>
          <p className="mb-6 text-sm text-slate-400 max-w-2xl">
            Democracy doesn't stop at voting every three years. These are the most effective ways to influence decisions between elections — ranked roughly by effort required.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {ACTIONS.map((action) => (
              <div key={action.title} className="card rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl shrink-0 mt-0.5">{action.icon}</div>
                  <h3 className="font-semibold text-white text-sm leading-snug">{action.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs text-slate-500">Difficulty: <Badge label={action.difficulty} color={action.diffColor} /></span>
                  <span className="text-xs text-slate-500">Time: <span className="text-slate-300">{action.time}</span></span>
                  <span className="text-xs text-slate-500">Impact: <Badge label={action.impact} color={action.impactColor} /></span>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{action.desc}</p>
                {action.link && (
                  <a href={action.link.href} target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300">
                    {action.link.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Your Rights ── */}
        <section id="rights" className="scroll-mt-20">
          <h2 className="mb-2 text-xl font-bold text-white">⚖️ Your Rights</h2>
          <p className="mb-6 text-sm text-slate-400 max-w-2xl">
            NZ does not have a supreme constitution like the US, but several Acts protect your fundamental rights. Parliament can override them — but must publicly declare when a law is inconsistent with the Bill of Rights.
          </p>
          <RightsDiagram />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                heading: 'NZ Bill of Rights Act 1990',
                color: '#10b981',
                act: 'BORA',
                body: 'Protects civil and political rights: freedom of expression, religion, and association; the right to vote; the right to a fair trial; freedom from arbitrary arrest; and protection from discrimination by the government. Courts can declare laws inconsistent with BORA, but Parliament retains the power to pass inconsistent laws — it must simply say so publicly. This transparency is the safeguard.',
              },
              {
                heading: 'Human Rights Act 1993',
                color: '#3b82f6',
                act: 'HRA',
                body: 'Prohibits discrimination in employment, education, housing, and the provision of goods and services based on sex, race, age, disability, religious belief, sexual orientation, family status, and other characteristics. The Human Rights Commission investigates complaints and can take cases to the Human Rights Review Tribunal. Unlike BORA, the HRA applies to private individuals and companies, not just the government.',
              },
              {
                heading: 'Official Information Act 1982',
                color: '#f59e0b',
                act: 'OIA',
                body: 'Gives you the right to request information held by government ministers, departments, and many state-owned entities. The core principle is that information should be released unless there is a good reason to withhold it — the burden is on the government to justify secrecy, not on you to justify curiosity. Agencies must respond within 20 working days. Use fyi.org.nz to send requests publicly.',
              },
              {
                heading: 'Privacy Act 2020',
                color: '#8b5cf6',
                act: 'Privacy',
                body: "Controls how agencies collect, use, store, and share your personal information. You have the right to ask any organisation what personal data they hold about you, and to request corrections if it is wrong. The Privacy Commissioner investigates complaints and can issue compliance notices. The 2020 Act (replacing the 1993 version) added mandatory breach notifications — organisations must tell you if your data is compromised.",
              },
            ].map((item) => (
              <div key={item.heading} className="card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded px-2 py-0.5 text-xs font-bold" style={{ background: `${item.color}20`, color: item.color }}>{item.act}</span>
                  <h3 className="font-semibold text-sm text-white">{item.heading}</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-6">
          <h3 className="mb-2 font-semibold text-white">Ready to act?</h3>
          <p className="mb-4 text-sm text-slate-300">
            Find your MP, check current bills open for submission, or have your say in our community polls.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/mps" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
              Find your MP →
            </Link>
            <Link href="/polls" className="rounded-lg border border-emerald-500/30 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/10">
              Community polls →
            </Link>
            <a href="https://www.parliament.nz/en/pb/sc/make-a-submission/" target="_blank" rel="noopener noreferrer"
              className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
              Make a submission ↗
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
