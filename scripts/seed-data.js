#!/usr/bin/env node
/**
 * scripts/seed-data.js
 *
 * Seeds the database with initial Fair Say NZ data:
 *   - 7 NZ parliamentary parties (as at 2026)
 *   - Starter civic content pages
 *
 * Usage:
 *   npx tsx scripts/seed-data.js
 *   npx tsx scripts/seed-data.js --dry-run
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const DRY_RUN = process.argv.includes('--dry-run');

// ── MongoDB ────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not set in .env');
  process.exit(1);
}

// ── Minimal inline schemas (avoids Next.js module graph) ──────────────────

const partySchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    spectrum: String,
    founded: Number,
    foundedYear: Number,
    current_leader: String,
    currentSeats: Number,
    seats: Number,
    government_status: String,
    core_policies: [String],
    coreValues: [String],
    history: String,
    controversies: [String],
    website: String,
    color: String,
    ideologyDescription: String,
    isParliamentary: Boolean,
  },
  { timestamps: true }
);
const Party = mongoose.models.Party || mongoose.model('Party', partySchema);

const civicContentSchema = new mongoose.Schema({ section: String, slug: String, title: String, markdownContent: String, order: Number, lastUpdated: Date, isPublished: Boolean }, { timestamps: true });
const CivicContent = mongoose.models.CivicContent || mongoose.model('CivicContent', civicContentSchema);

// ── Seed data ──────────────────────────────────────────────────────────────

const PARTIES = [
  {
    name: "National Party",
    slug: 'national',
    spectrum: "centre-right",
    founded: 1936,
    foundedYear: 1936,
    current_leader: "Christopher Luxon",
    seats: 49,
    currentSeats: 49,
    government_status: "governing",
    website: 'https://www.national.org.nz',
    color: '#00529b',
    core_policies: [
      "Lower taxes and reduced government spending",
      "Economic growth and business-friendly regulation",
      "Law and order, tougher sentencing",
      "Infrastructure investment",
      "Treaty of Waitangi principles reform"
    ],
    coreValues: ['Lower taxes', 'Fiscal responsibility', 'Economic opportunity', 'Individual freedom', 'Strong public services'],
    history: "New Zealand's dominant centre-right party, National has governed for much of the post-war era. Currently leads the coalition government with ACT and NZ First following the 2023 election, with Christopher Luxon as Prime Minister.",
    controversies: [
      "Fast-track Approvals Act 2024 criticised for bypassing environmental oversight",
      "Reinstated three-strikes sentencing laws opposed by justice advocates",
      "Passed Electoral Amendment Act 2025 restricting voter enrolment, criticised as voter suppression"
    ],
    ideologyDescription: 'The National Party is a centre-right party that emphasises economic growth, lower taxes, business-friendly policy, and national security.',
    isParliamentary: true,
  },
  {
    name: "ACT New Zealand",
    slug: 'act',
    spectrum: "libertarian-right",
    founded: 1994,
    foundedYear: 1994,
    current_leader: "David Seymour",
    seats: 11,
    currentSeats: 11,
    government_status: "governing",
    website: 'https://www.act.org.nz',
    color: '#fde100',
    core_policies: [
      "Free market economics",
      "Individual freedom and personal responsibility",
      "Reduced government size and regulation",
      "Charter schools and education choice",
      "Treaty Principles Bill — redefining Treaty of Waitangi principles"
    ],
    coreValues: ['Individual responsibility', 'Economic freedom', 'Limited government', 'Personal liberty', 'Rule of law'],
    history: "ACT was founded on classical liberal principles. Under David Seymour it has grown significantly, going from 1 seat in 2017 to 11 seats in 2023. Now a junior coalition partner with National and NZ First.",
    controversies: [
      "Treaty Principles Bill sparked nationwide protests and a parliamentary haka from Te Pāti Māori",
      "Regulatory Standards Act 2025 passed under Seymour as Deputy PM, criticised for reducing regulatory oversight",
      "Consistent opposition to Māori co-governance arrangements"
    ],
    ideologyDescription: 'ACT is a libertarian-right party that advocates for individual liberty, free markets, lower taxes, and reduced government regulation.',
    isParliamentary: true,
  },
  {
    name: "New Zealand First",
    slug: 'nzfirst',
    spectrum: "populist-nationalist",
    founded: 1993,
    foundedYear: 1993,
    current_leader: "Winston Peters",
    seats: 8,
    currentSeats: 8,
    government_status: "governing",
    website: 'https://www.nzfirst.org.nz',
    color: '#000000',
    core_policies: [
      "New Zealand sovereignty and anti-globalism",
      "Superannuation protection",
      "Controlled immigration",
      "Support for rural communities and Southland",
      "Referendum to abolish Māori electorates"
    ],
    coreValues: ['NZ first policy', 'Pragmatic governance', 'Provincial representation', 'Social stability', 'Economic security'],
    history: "Founded by Winston Peters after leaving National. A recurring kingmaker in NZ politics. Was ousted from Parliament in 2020 but returned in 2023 to join the current coalition government as a minor partner.",
    controversies: [
      "Referendum on abolishing Māori electorates is a recurring and divisive policy",
      "Peters' long history of political controversy and coalition switching",
      "Opposed environmental protections in coalition negotiations"
    ],
    ideologyDescription: 'NZ First is a nationalist and populist party that emphasises New Zealand sovereignty, controlled immigration, and support for seniors and provincial voters.',
    isParliamentary: true,
  },
  {
    name: "Labour Party",
    slug: 'labour',
    spectrum: "centre-left",
    founded: 1916,
    foundedYear: 1916,
    current_leader: "Chris Hipkins",
    seats: 34,
    currentSeats: 34,
    government_status: "opposition",
    website: 'https://www.labour.org.nz',
    color: '#d82d20',
    core_policies: [
      "Workers rights and fair wages",
      "Public health and education investment",
      "Housing affordability",
      "Climate change action",
      "Social services and welfare"
    ],
    coreValues: ['Fairness', 'Social justice', 'Economic inclusion', 'Public wellbeing', 'Progressive climate policy'],
    history: "One of NZ's two major parties. Under Jacinda Ardern won an outright MMP majority in 2020 with 65 seats — a historic result. Suffered a massive defeat in 2023, dropping to just 34 seats, the worst loss by a sitting government under MMP.",
    controversies: [
      "Suffered the worst MMP-era defeat of a sitting government in 2023",
      "Three Waters reform was scrapped after widespread public opposition",
      "MP Michael Wood referred to Privileges Committee for undisclosed shares"
    ],
    ideologyDescription: 'Labour is a centre-left party focused on workers’ rights, public services, social equity, and climate action.',
    isParliamentary: true,
  },
  {
    name: "Green Party",
    slug: 'greens',
    spectrum: "left-environmentalist",
    founded: 1990,
    foundedYear: 1990,
    current_leader: "Chlöe Swarbrick and Marama Davidson (co-leaders)",
    seats: 15,
    currentSeats: 15,
    government_status: "opposition",
    website: 'https://www.greens.org.nz',
    color: '#098137',
    core_policies: [
      "Climate change and environmental protection",
      "Wealth tax and income equality",
      "Social justice and housing",
      "Drug law reform",
      "Public transport and green infrastructure"
    ],
    coreValues: ['Environmental protection', 'Social justice', 'Te Tiriti partnership', 'Community wellbeing', 'Sustainable development'],
    history: "The Greens have had continuous parliamentary representation since 1996. Won 15 seats in 2023, their largest ever caucus. Chlöe Swarbrick became co-leader in March 2024, replacing James Shaw.",
    controversies: [
      "Swarbrick's member's bill calling for sanctions against Israel was contentious",
      "Co-leader Marama Davidson made controversial comments about male violence following an incident in 2024",
      "Four Green/Labour MPs referred to Privileges Committee over haka disruption of Treaty Principles Bill vote"
    ],
    ideologyDescription: 'The Green Party is a left-wing environmentalist party that prioritises climate action, social equality, and Māori partnership.',
    isParliamentary: true,
  },
  {
    name: "Te Pāti Māori",
    slug: 'maori',
    spectrum: "indigenous-rights-left",
    founded: 2004,
    foundedYear: 2004,
    current_leader: "Rawiri Waititi and Debbie Ngarewa-Packer (co-leaders)",
    seats: 6,
    currentSeats: 6,
    government_status: "opposition",
    website: 'https://www.maoriparty.nz',
    color: '#e4001b',
    core_policies: [
      "Māori sovereignty and self-determination",
      "Treaty of Waitangi honour and enforcement",
      "Māori land and language rights",
      "Criminal justice reform",
      "Parliamentary Commissioner for Te Tiriti o Waitangi"
    ],
    coreValues: ['Tiriti justice', 'Whānau wellbeing', 'Māori self-determination', 'Cultural revitalisation', 'Equitable outcomes'],
    history: "Founded in 2004 following the foreshore and seabed controversy. Won a record six Māori electorate seats in 2023, creating two overhang seats in Parliament. A vocal and increasingly prominent opposition force.",
    controversies: [
      "Co-leaders found in contempt of Parliament for haka disruption of Treaty Principles Bill vote",
      "MP Tākuta Ferris ordered to apologise after Privileges Committee found he deliberately misled the House",
      "Allegations of illegally using census data to target Māori voters in 2023 election",
      "Internal party expulsions of MPs Mariameno Kapa-Kingi and Tākuta Ferris in 2025, later legally contested"
    ],
    ideologyDescription: 'Te Pāti Māori focuses on Māori rights, te Tiriti o Waitangi partnership, indigenous wellbeing, and greater Māori representation in government.',
    isParliamentary: true,
  },
];

const CIVIC_CONTENT = [
  {
    section: 'how-government-works',
    slug: 'overview',
    title: 'How NZ Government Works — Overview',
    order: 1,
    markdownContent: `# How the NZ Government Works

New Zealand is a **constitutional monarchy** and a **parliamentary democracy**. This page gives you a factual, neutral overview.

## Key institutions

| Institution | Role |
|---|---|
| Parliament | Makes laws, holds the government accountable |
| The Executive (Cabinet) | Runs the country day-to-day |
| The Judiciary | Interprets and applies the law |
| Local Government | Delivers local services (rates, water, roads, planning) |

## MMP Electoral System

NZ uses **Mixed Member Proportional (MMP)** voting. Each voter gets two votes:
1. **Electorate vote** — for a local MP
2. **Party vote** — determines the share of seats each party gets in Parliament

Parliament has 120 seats. Parties need either **5% of the party vote** or **one electorate seat** to enter Parliament.

## How a bill becomes law

1. First reading — debate and referral to select committee
2. Select committee — public submissions accepted (you can submit!)
3. Second reading — amended bill debated
4. Committee of the whole House — clause-by-clause
5. Third reading — final debate and vote
6. Royal Assent — Governor-General signs it into law

## Sources
- [parliament.nz — About Parliament](https://www.parliament.nz/en/visit-and-learn/how-parliament-works/)
- [Electoral Commission — How MMP works](https://elections.nz/democracy-in-nz/what-is-new-zealands-voting-system/what-is-mmp/)
`,
  },
  {
    section: 'influence-avenues',
    slug: 'overview',
    title: 'Real Ways to Influence Government',
    order: 1,
    markdownContent: `# Real Ways to Influence Government

Voting is just the start. Here are **proven, legal ways** every New Zealander can influence government decisions.

## 1. Select Committee Submissions
When Parliament is considering a bill, you can submit your view. Any person or organisation may submit — your submission becomes part of the official record.

**How to submit:** [parliament.nz/en/pb/sc/make-a-submission](https://www.parliament.nz/en/pb/sc/make-a-submission/)

## 2. Contact Your MP
Every NZ electorate has a local MP. You can email or phone them about any issue. List MPs can also be contacted via their party.

**Find your MP:** [parliament.nz — MPs](https://www.parliament.nz/en/mps-and-electorates/members-of-parliament/)

## 3. Official Information Act (OIA) Requests
Under the OIA, you can request information held by government agencies. Agencies must respond within 20 working days.

**How to submit an OIA:** [ombudsman.parliament.nz](https://www.ombudsman.parliament.nz/make-oia-request)

## 4. Petitions to Parliament
You can present a petition to Parliament through any MP. Petitions with enough signatures may be considered by a select committee.

## 5. Local Council Submissions
Every NZ council must publicly consult on its Annual Plan and Long-Term Plan. You can speak at council hearings.

## 6. Citizens Initiated Referendums
If you gather 10% of eligible voters\' signatures within 12 months, a citizens-initiated referendum can be held.

## Sources
- [parliament.nz — Have your say](https://www.parliament.nz/en/get-involved/)
- [localcouncils.govt.nz](https://www.localcouncils.govt.nz/)
`,
  },
  {
    section: 'mmp-explained',
    slug: 'how-mmp-works',
    title: 'MMP Explained',
    order: 1,
    markdownContent: `# MMP — Mixed Member Proportional

MMP was adopted by New Zealand in 1996 following a referendum. It replaced First Past the Post (FPP).

## Your two votes

**Electorate vote:** Elects a local MP for your electorate. The candidate with the most votes wins, regardless of party.

**Party vote:** This is the most important vote for overall Parliament composition. It determines the proportion of seats each party gets.

## The 5% threshold and coat-tailing

- A party needs **5% of the party vote** to enter Parliament — OR —
- If a party wins **at least one electorate seat**, they can bring in list MPs even with under 5% (the "coat-tail" rule)

## Overhang seats

If a party wins more electorate seats than their party vote entitles them to, Parliament gains extra seats ("overhang"). This is why Parliament sometimes has more than 120 MPs.

## Sources
- [elections.nz — MMP](https://elections.nz/democracy-in-nz/what-is-new-zealands-voting-system/what-is-mmp/)
- [Electoral Commission](https://elections.nz)
`,
  },
];

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌿 Fair Say NZ seed script ${DRY_RUN ? '(DRY RUN)' : ''}\n`);

  if (!DRY_RUN) {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('✅  Connected to MongoDB\n');
  }

  // Parties
  console.log(`📦 Seeding ${PARTIES.length} parties…`);
  if (!DRY_RUN) {
    for (const party of PARTIES) {
      await Party.updateOne({ slug: party.slug }, { $set: party }, { upsert: true });
      console.log(`   ✓ ${party.name}`);
    }
  } else {
    PARTIES.forEach((p) => console.log(`   [dry] ${p.name}`));
  }

  // Civic content
  console.log(`\n📄 Seeding ${CIVIC_CONTENT.length} civic content pages…`);
  if (!DRY_RUN) {
    for (const page of CIVIC_CONTENT) {
      await CivicContent.updateOne(
        { section: page.section, slug: page.slug },
        { $set: { ...page, lastUpdated: new Date(), isPublished: true } },
        { upsert: true }
      );
      console.log(`   ✓ [${page.section}] ${page.title}`);
    }
  } else {
    CIVIC_CONTENT.forEach((p) => console.log(`   [dry] [${p.section}] ${p.title}`));
  }

  console.log('\n🎉 Done!\n');
  if (!DRY_RUN) await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
