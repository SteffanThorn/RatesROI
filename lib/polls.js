export const POLLS = [
  {
    id: 'party-vote-2026',
    type: 'election-vote',
    question: 'If the 2026 general election were held today, which party would you give your party vote to?',
    note: 'Verified voters only · One vote per person',
    options: [
      { label: 'National', color: '#1a56a4' },
      { label: 'Labour', color: '#cc0000' },
      { label: 'ACT', color: '#f9c03a' },
      { label: 'Green', color: '#098137' },
      { label: 'NZ First', color: '#000000' },
      { label: 'Te Pāti Māori', color: '#b5281e' },
      { label: 'The Opportunities Party', color: '#5c40b5' },
      { label: 'Undecided / Other', color: '#6b7280' },
    ],
  },
  {
    id: 'top-issue-2026',
    type: 'general',
    question: 'What is the most important issue facing New Zealand right now?',
    note: 'Verified voters only · One vote per person',
    options: [
      { label: 'Cost of living & inflation', color: '#f97316' },
      { label: 'Housing affordability', color: '#a855f7' },
      { label: 'Healthcare & hospital wait times', color: '#06b6d4' },
      { label: 'Climate change & environment', color: '#22c55e' },
      { label: 'Crime & public safety', color: '#ef4444' },
      { label: 'Education & child poverty', color: '#3b82f6' },
      { label: 'Treaty of Waitangi / Māori affairs', color: '#b5281e' },
      { label: 'Economic growth & jobs', color: '#f59e0b' },
    ],
  },
  {
    id: 'mp-representation',
    type: 'general',
    question: 'Do you feel adequately represented by your local MP?',
    note: 'Verified voters only · Find your MP on the MPs page',
    options: [
      { label: 'Yes, very well', color: '#22c55e' },
      { label: 'Mostly yes', color: '#86efac' },
      { label: 'Neutral / not sure', color: '#94a3b8' },
      { label: 'Mostly no', color: '#fca5a5' },
      { label: 'No, not at all', color: '#ef4444' },
    ],
  },
  {
    id: 'mmp-threshold',
    type: 'general',
    question: 'Should the MMP 5% threshold be lowered to give smaller parties a better chance?',
    note: 'Verified voters only · The current threshold has been debated since MMP was adopted',
    options: [
      { label: 'Yes — lower it to 3–4%', color: '#22c55e' },
      { label: 'Yes — abolish the threshold entirely', color: '#86efac' },
      { label: 'Keep it at 5%', color: '#94a3b8' },
      { label: 'Raise it above 5%', color: '#f97316' },
      { label: 'Not sure', color: '#6b7280' },
    ],
  },
];

export function getPollById(id) {
  return POLLS.find((p) => p.id === id) ?? null;
}
