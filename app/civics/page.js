import Link from 'next/link';

export const metadata = {
  title: 'Civics',
  description: 'How NZ government works, MMP explained, how laws are made, and real ways to have your say.',
};

const SECTIONS = [
  {
    id: 'government',
    icon: '🏛️',
    title: 'How NZ Government Works',
    content: [
      {
        heading: 'Parliament',
        body: 'New Zealand has a unicameral (single-chamber) Parliament with 120 seats. MPs debate and pass laws, approve government spending, and hold the executive to account. Parliament sits in Wellington and is elected every three years.',
      },
      {
        heading: 'The Executive (Cabinet)',
        body: 'The Prime Minister and Cabinet Ministers run the day-to-day government. Cabinet is responsible to Parliament — if Parliament loses confidence in the government, an election can be triggered. Ministers are answerable to the public through Parliamentary questions and the media.',
      },
      {
        heading: 'The Governor-General',
        body: "The Governor-General is the King's representative in NZ. They give Royal Assent to turn bills into law, open Parliament, and can dissolve Parliament to trigger an election. The role is largely ceremonial — they act on the advice of elected ministers.",
      },
      {
        heading: 'The Courts',
        body: 'The judiciary — District Courts, High Court, Court of Appeal, and the Supreme Court — interprets and applies the law independently of Parliament and the executive. Courts can strike down actions that violate the NZ Bill of Rights Act.',
      },
      {
        heading: 'Local Government',
        body: 'NZ has 78 councils: 11 regional councils (environment, transport, civil defence) and 67 territorial authorities (cities and district councils). Local elections are held every three years. Councils control planning, water, rates, and local infrastructure.',
      },
    ],
  },
  {
    id: 'mmp',
    icon: '🗳️',
    title: 'MMP Explained',
    content: [
      {
        heading: 'Two votes, one ballot',
        body: 'Under Mixed-Member Proportional (MMP), you have two votes. Your electorate vote chooses the local MP for your area. Your party vote determines how many seats each party gets in Parliament overall — this is the more powerful vote.',
      },
      {
        heading: 'The 5% threshold',
        body: 'A party must win at least 5% of the total party vote, OR win at least one electorate seat, to enter Parliament. This prevents extreme fragmentation while allowing small parties a path in.',
      },
      {
        heading: 'The coattail rule',
        body: 'If a party wins an electorate seat, they bring in additional MPs proportional to their party vote — even if that vote is below 5%. This is the "coattail" or "one-seat lifeboat" rule.',
      },
      {
        heading: 'Overhang seats',
        body: "If a party wins more electorate seats than their party vote entitles them to, Parliament temporarily expands to accommodate them. These extra seats are called 'overhang' seats.",
      },
      {
        heading: 'List MPs vs Electorate MPs',
        body: 'Electorate MPs are directly elected in your local seat. List MPs fill remaining seats so that the final composition matches each party\'s party vote share. Both types of MP have equal voting rights in Parliament.',
      },
    ],
  },
  {
    id: 'lawmaking',
    icon: '📜',
    title: 'How Laws Are Made',
    steps: [
      { label: '1. Introduction & First Reading', desc: 'A bill is introduced to Parliament. MPs vote on whether to progress it to the next stage. A short debate outlines what the bill does.' },
      { label: '2. Select Committee', desc: 'The bill goes to a specialist committee of MPs. The committee calls for public submissions — any NZ resident can make one. This is your most direct opportunity to shape legislation.' },
      { label: '3. Second Reading', desc: 'Parliament debates the select committee\'s recommendations. MPs vote on the principles of the bill.' },
      { label: '4. Committee of the Whole House', desc: 'All MPs sit as a committee and go through the bill clause by clause. Amendments can be made at this stage.' },
      { label: '5. Third Reading', desc: 'A final debate and vote. If passed, the bill is sent to the Governor-General.' },
      { label: '6. Royal Assent', desc: "The Governor-General signs the bill into law on the advice of the Prime Minister. It becomes an Act of Parliament." },
    ],
  },
  {
    id: 'influence',
    icon: '📣',
    title: 'Real Ways to Have Your Say',
    actions: [
      {
        title: 'Make a select committee submission',
        difficulty: 'Easy',
        time: '30–60 min',
        impact: 'High',
        desc: 'When Parliament is considering a bill, anyone in NZ can write a submission — even just a few sentences. Submissions are read by MPs and can directly change legislation. Check parliament.nz/en/pb/sc/make-a-submission for open submissions.',
      },
      {
        title: 'Contact your MP',
        difficulty: 'Easy',
        time: '5–15 min',
        impact: 'Medium',
        desc: 'Email or call your electorate MP about an issue. MPs are required to respond to constituents. Find their contact on the MPs page here, or at parliament.nz.',
      },
      {
        title: 'File an OIA request',
        difficulty: 'Easy',
        time: '5 min',
        impact: 'Medium',
        desc: 'Under the Official Information Act, you can request any information held by government agencies. Agencies must respond within 20 working days. Use fyi.org.nz to send and track requests publicly.',
      },
      {
        title: 'Sign or create a parliamentary petition',
        difficulty: 'Easy',
        time: '2–30 min',
        impact: 'Medium',
        desc: 'A petition with enough signatures is debated in Parliament. Any NZ resident can create one at parliament.nz. Petitions with large numbers of signatories receive a formal government response.',
      },
      {
        title: 'Attend your local council meeting',
        difficulty: 'Medium',
        time: '2–3 hours',
        impact: 'High (local)',
        desc: 'Council meetings are open to the public. You can speak during public participation sessions. This is especially impactful for local planning, rates, and infrastructure decisions.',
      },
      {
        title: 'Stand as a candidate',
        difficulty: 'Hard',
        time: 'Months',
        impact: 'Very High',
        desc: 'Any eligible NZ voter can stand for Parliament or local council. Local council is more accessible — smaller campaigns, lower costs, direct community impact.',
      },
    ],
  },
  {
    id: 'rights',
    icon: '⚖️',
    title: 'Your Rights',
    content: [
      {
        heading: 'NZ Bill of Rights Act 1990',
        body: 'Protects civil and political rights: freedom of expression, freedom of religion, freedom of association, the right to vote, the right to a fair trial, and protection from discrimination. Courts can declare laws inconsistent with the Bill of Rights, though Parliament can still override it.',
      },
      {
        heading: 'Human Rights Act 1993',
        body: 'Prohibits discrimination in employment, education, housing, and the provision of goods and services on the grounds of sex, race, age, disability, religion, sexual orientation, and other characteristics. The Human Rights Commission handles complaints.',
      },
      {
        heading: 'Official Information Act 1982',
        body: 'Gives you the right to request information held by government ministers, departments, and many state-owned entities. The presumption is that information should be released unless there is good reason to withhold it.',
      },
      {
        heading: 'Privacy Act 2020',
        body: "Controls how agencies collect, use, and store your personal information. You have the right to request and correct information held about you. The Privacy Commissioner investigates complaints.",
      },
    ],
  },
];

function DifficultyBadge({ label }) {
  const map = {
    Easy: 'bg-emerald-500/15 text-emerald-300',
    Medium: 'bg-amber-500/15 text-amber-300',
    Hard: 'bg-red-500/15 text-red-300',
    'Very High': 'bg-emerald-500/15 text-emerald-300',
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${map[label] || 'bg-slate-500/15 text-slate-300'}`}>
      {label}
    </span>
  );
}

export default function CivicsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">📚 Civics</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          How New Zealand government works — explained plainly, without party spin.
          Understanding the system is the first step to changing it.
        </p>
      </header>

      {/* Jump links */}
      <nav className="mb-10 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
          >
            {s.icon} {s.title}
          </a>
        ))}
      </nav>

      <div className="space-y-12">

        {/* How NZ Government Works */}
        <section id="government" className="scroll-mt-20">
          <h2 className="mb-5 text-xl font-bold text-white">{SECTIONS[0].icon} {SECTIONS[0].title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SECTIONS[0].content.map((item) => (
              <div key={item.heading} className="card rounded-2xl p-5">
                <h3 className="mb-2 font-semibold text-white">{item.heading}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MMP */}
        <section id="mmp" className="scroll-mt-20">
          <h2 className="mb-5 text-xl font-bold text-white">{SECTIONS[1].icon} {SECTIONS[1].title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SECTIONS[1].content.map((item) => (
              <div key={item.heading} className="card rounded-2xl p-5">
                <h3 className="mb-2 font-semibold text-white">{item.heading}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 px-5 py-4">
            <p className="text-xs text-blue-200 leading-relaxed">
              <strong>Tip:</strong> Your party vote is almost always more impactful than your electorate vote in determining the shape of Parliament. If you want a small party in Parliament, your party vote for them counts even if you prefer a different electorate MP.
            </p>
          </div>
        </section>

        {/* How Laws Are Made */}
        <section id="lawmaking" className="scroll-mt-20">
          <h2 className="mb-5 text-xl font-bold text-white">{SECTIONS[2].icon} {SECTIONS[2].title}</h2>
          <div className="card rounded-2xl p-6">
            <div className="relative space-y-0">
              {SECTIONS[2].steps.map((step, i) => (
                <div key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    {i < SECTIONS[2].steps.length - 1 && (
                      <div className="my-1 w-px flex-1 bg-emerald-600/30" style={{ minHeight: '32px' }} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="font-semibold text-white">{step.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{step.desc}</p>
                    {step.label.includes('Select Committee') && (
                      <a
                        href="https://www.parliament.nz/en/pb/sc/make-a-submission/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300"
                      >
                        Make a submission ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ways to Influence */}
        <section id="influence" className="scroll-mt-20">
          <h2 className="mb-5 text-xl font-bold text-white">{SECTIONS[3].icon} {SECTIONS[3].title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SECTIONS[3].actions.map((action) => (
              <div key={action.title} className="card rounded-2xl p-5">
                <h3 className="mb-3 font-semibold text-white">{action.title}</h3>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    Difficulty: <DifficultyBadge label={action.difficulty} />
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    Time: <span className="text-slate-300">{action.time}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    Impact: <DifficultyBadge label={action.impact} />
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{action.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Your Rights */}
        <section id="rights" className="scroll-mt-20">
          <h2 className="mb-5 text-xl font-bold text-white">{SECTIONS[4].icon} {SECTIONS[4].title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SECTIONS[4].content.map((item) => (
              <div key={item.heading} className="card rounded-2xl p-5">
                <h3 className="mb-2 font-semibold text-white">{item.heading}</h3>
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
            <a
              href="https://www.parliament.nz/en/pb/sc/make-a-submission/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Make a submission ↗
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
