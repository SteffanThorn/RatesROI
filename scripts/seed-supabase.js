#!/usr/bin/env node
/**
 * scripts/seed-supabase.js
 *
 * Seeds all Fair Say NZ content into Supabase: parties + MPs.
 *
 * Usage:
 *   npx tsx scripts/seed-supabase.js
 *   npx tsx scripts/seed-supabase.js --dry-run
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const DRY_RUN = process.argv.includes('--dry-run');

let supabase;

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Parties ────────────────────────────────────────────────────────────────

const PARTIES = [
  {
    name: 'National Party',
    slug: 'national',
    spectrum: 'centre-right',
    founded_year: 1936,
    current_leader: 'Christopher Luxon',
    current_seats: 49,
    government_status: 'Government (lead party)',
    website: 'https://www.national.org.nz',
    color: '#00529b',
    core_values: ['Lower taxes', 'Fiscal responsibility', 'Economic opportunity', 'Individual freedom', 'Strong public services'],
    ideology_description: 'The New Zealand National Party is a centre-right party founded in 1936. It emphasises free-market economics, lower taxes, individual responsibility, and strong law enforcement. National typically supports business-friendly policy, fiscal restraint, and a pragmatic approach to social policy.',
    controversies: [
      'Fast-track Approvals Act 2024 criticised for bypassing environmental oversight',
      'Reinstated three-strikes sentencing laws opposed by justice advocates',
      'Passed Electoral Amendment Act 2025 restricting voter enrolment, criticised as voter suppression',
    ],
    is_parliamentary: true,
  },
  {
    name: 'ACT New Zealand',
    slug: 'act',
    spectrum: 'libertarian-right',
    founded_year: 1994,
    current_leader: 'David Seymour',
    current_seats: 11,
    government_status: 'Government (coalition partner)',
    website: 'https://www.act.org.nz',
    color: '#fde100',
    core_values: ['Individual responsibility', 'Economic freedom', 'Limited government', 'Personal liberty', 'Rule of law'],
    ideology_description: 'ACT New Zealand is a right-libertarian party founded in 1994. It advocates for minimal government, personal freedom, free-market economics, and substantial reduction in government spending and regulation.',
    controversies: [
      'Treaty Principles Bill sparked nationwide protests and a parliamentary haka — voted down 11-112 in April 2025',
      'Regulatory Standards Act 2025 passed under Seymour as Deputy PM, criticised for reducing regulatory oversight',
      'Consistent opposition to Māori co-governance arrangements',
    ],
    is_parliamentary: true,
  },
  {
    name: 'New Zealand First',
    slug: 'nzfirst',
    spectrum: 'populist-nationalist',
    founded_year: 1993,
    current_leader: 'Winston Peters',
    current_seats: 8,
    government_status: 'Government (coalition partner)',
    website: 'https://www.nzfirst.org.nz',
    color: '#000000',
    core_values: ['NZ first policy', 'Pragmatic governance', 'Provincial representation', 'Social stability', 'Economic security'],
    ideology_description: 'New Zealand First was founded by Winston Peters in 1993 after he left National. It takes populist, nationalist positions — supporting NZ manufacturing, restricting immigration, opposing co-governance, and advocating for Māori electoral reform.',
    controversies: [
      'Referendum on abolishing Māori electorates is a recurring and divisive policy',
      "Peters' long history of political controversy and coalition switching",
      'Opposed environmental protections in coalition negotiations',
    ],
    is_parliamentary: true,
  },
  {
    name: 'Labour Party',
    slug: 'labour',
    spectrum: 'centre-left',
    founded_year: 1916,
    current_leader: 'Chris Hipkins',
    current_seats: 34,
    government_status: 'Opposition',
    website: 'https://www.labour.org.nz',
    color: '#d82d20',
    core_values: ['Fairness', 'Social justice', 'Economic inclusion', 'Public wellbeing', 'Progressive climate policy'],
    ideology_description: "New Zealand Labour is a centre-left party founded in 1916 from the trade union movement. It prioritises social welfare, workers' rights, public services, and reducing inequality.",
    controversies: [
      'Suffered the worst MMP-era defeat of a sitting government in 2023',
      'Three Waters reform was scrapped after widespread public opposition',
      'MP Michael Wood referred to Privileges Committee for undisclosed shares',
    ],
    is_parliamentary: true,
  },
  {
    name: 'Green Party',
    slug: 'greens',
    spectrum: 'left-environmentalist',
    founded_year: 1990,
    current_leader: 'Chlöe Swarbrick & Marama Davidson (co-leaders)',
    current_seats: 15,
    government_status: 'Opposition',
    website: 'https://www.greens.org.nz',
    color: '#098137',
    core_values: ['Environmental protection', 'Social justice', 'Te Tiriti partnership', 'Community wellbeing', 'Sustainable development'],
    ideology_description: 'The Green Party of Aotearoa New Zealand was founded in 1990 from the Values Party tradition. It combines environmental policy with progressive social policy — climate action, income support, housing, and Te Tiriti commitments.',
    controversies: [
      "Swarbrick's member's bill calling for sanctions against Israel was contentious",
      'Co-leader Marama Davidson made controversial comments about male violence following an incident in 2024',
      'Four Green/Labour MPs referred to Privileges Committee over haka disruption of Treaty Principles Bill vote',
    ],
    is_parliamentary: true,
  },
  {
    name: 'Te Pāti Māori',
    slug: 'maori',
    spectrum: 'indigenous-rights-left',
    founded_year: 2004,
    current_leader: 'Rawiri Waititi & Debbie Ngarewa-Packer (co-leaders)',
    current_seats: 6,
    government_status: 'Opposition',
    website: 'https://www.maoriparty.nz',
    color: '#e4001b',
    core_values: ['Tiriti justice', 'Whānau wellbeing', 'Māori self-determination', 'Cultural revitalisation', 'Equitable outcomes'],
    ideology_description: 'Te Pāti Māori was re-established in 2004 following the foreshore and seabed controversy. It advocates for Māori self-determination (tino rangatiratanga), Treaty-based governance, Māori language and culture, and redistributive economic policy.',
    controversies: [
      'Co-leaders found in contempt of Parliament for haka disruption of Treaty Principles Bill vote',
      'MP Tākuta Ferris ordered to apologise after Privileges Committee found he deliberately misled the House',
      'Allegations of illegally using census data to target Māori voters in 2023 election',
      'Internal party expulsions of MPs Mariameno Kapa-Kingi and Tākuta Ferris in 2025, later legally contested',
    ],
    is_parliamentary: true,
  },
];

// ── MPs ────────────────────────────────────────────────────────────────────

const MPS_BY_PARTY = {
  national: [
    {
      name: 'Christopher Luxon',
      role: 'Prime Minister',
      type: 'electorate',
      electorate: 'Botany',
      political_spectrum: 'centre-right',
      career_before_politics: ['Joined Unilever in 1993, rose to President and CEO of Unilever Canada', 'CEO of Air New Zealand 2013–2019'],
      career_in_politics: ['MP for Botany since 2020', 'Leader of the Opposition 2021–2023', 'Prime Minister since November 2023'],
      key_positions: ['Lower taxes and reduced public spending', 'Economic growth through business investment', 'Reduced co-governance and Treaty of Waitangi provisions in legislation', 'Law and order — reinstated three-strikes sentencing'],
      accomplishments: ["Led National to victory in 2023 election after four years in opposition", "Formed NZ's first formal three-party coalition government", 'Delivered NZ$14.7 billion in tax cuts', 'Reduced public service headcount significantly'],
      controversies: ['Criticised for using taxpayer funds for te reo lessons as Opposition leader, then discouraging te reo use in public service as PM', 'Coalition seen as unstable — David Seymour and Winston Peters have publicly contradicted him', 'Presided over a prolonged recession with economists criticising his economic approach', 'Leadership repeatedly questioned within caucus through 2025'],
    },
    {
      name: 'Nicola Willis',
      role: 'Minister of Finance, Deputy Leader',
      type: 'electorate',
      electorate: 'Ōhāriu',
      political_spectrum: 'centre-right (liberal wing)',
      career_before_politics: ['Political advisor and corporate lobbyist', 'First-class honours in English Literature, Victoria University of Wellington'],
      career_in_politics: ['List MP from 2018', 'MP for Ōhāriu since 2020', 'Deputy Leader of National since 2021', 'Minister of Finance since November 2023'],
      key_positions: ['Fiscal responsibility and reduced government spending', 'Tax relief for working families via FamilyBoost and bracket adjustments', 'Social investment approach to welfare'],
      accomplishments: ['Delivered major tax cut package in 2024', 'First Minister for Economic Growth appointed January 2025', 'Managed significant public service restructuring'],
      controversies: ['Tax cut plan criticised by economists and Winston Peters for creating a $5.6b fiscal hole', 'Admitted only 3,000 households would receive full tax relief — accused of misleading voters', 'Group of 15 economists wrote open letter condemning her economic policies as harmful to poorest New Zealanders', "Declined KiwiRail's $1.47b ferry replacement request"],
    },
    {
      name: 'Chris Bishop',
      role: 'Minister of Housing, Attorney-General',
      type: 'electorate',
      electorate: 'Hutt South',
      political_spectrum: 'centre-right',
      career_before_politics: ['Lobbyist for tobacco company Philip Morris', 'Member of NZ Youth Parliament 2000'],
      career_in_politics: ["MP for Hutt South", "Chairperson of National's 2023 Election Campaign", 'Minister of Housing, Infrastructure, RMA Reform, Sport and Recreation, Leader of the House 2023–2026', 'Attorney-General from April 2026'],
      key_positions: ['Significant housing supply reform', 'RMA (Resource Management Act) overhaul', 'Tougher state housing tenancy rules'],
      accomplishments: ["Named 'Politician of the Year' by The Post in 2025", "Described as 'minister for everything' for his outsized influence in government", 'Led major RMA reform legislation'],
      controversies: ['Former lobbyist for Philip Morris tobacco company', "Filmed calling a Māori cultural performance 'a load of crap' at 2025 Aotearoa Music Awards — appeared to be intoxicated", 'Reported to have attempted to gather support to challenge Luxon for leadership in November 2025', 'State housing eviction policy criticised as vindictive by opposition'],
    },
    {
      name: 'Shane Reti',
      role: 'Minister of Health',
      type: 'electorate',
      electorate: 'Whangārei',
      political_spectrum: 'centre-right',
      career_before_politics: ['Medical doctor and GP', 'Served in rural Northland communities'],
      career_in_politics: ['MP for Whangārei since 2017', 'Served as interim National Party leader briefly in 2021', 'Minister of Health since November 2023'],
      key_positions: ['Health system reform and efficiency', 'Reducing health bureaucracy', 'Rural health access'],
      accomplishments: ['Oversaw dismantling of Te Whatu Ora (Health NZ) structure inherited from Labour', 'Brought medical professional background to health portfolio'],
      controversies: ['Health NZ placed under commissioner in 2024 amid financial crisis and significant job losses', 'Presided over major cuts to health workforce'],
    },
    {
      name: 'Judith Collins',
      role: 'Minister for National Security and Intelligence',
      type: 'electorate',
      electorate: 'Papakura',
      political_spectrum: 'centre-right (conservative wing)',
      career_before_politics: ['Lawyer'],
      career_in_politics: ['MP for Papakura since 2002', 'Mother of the House — longest-serving female MP', 'Leader of the National Party 2020–2021', 'Multiple ministerial roles across National governments including Justice, Police, Corrections'],
      key_positions: ['Law and order hardliner', 'Strong national security stance', 'Sceptic of co-governance'],
      accomplishments: ['One of the longest-serving MPs in NZ history', 'Held major portfolios across multiple National governments', 'Led National through a difficult period as leader in 2020–2021'],
      controversies: ["Nicknamed 'Crusher Collins' for proposing to crush boy racers' cars", 'Ousted as National leader in 2021 after a series of internal caucus crises', 'Demoted and reinstated multiple times during internal party conflicts', 'Accused of political revenge against Simon Bridges before her removal as leader'],
    },
    {
      name: 'Erica Stanford',
      role: 'Minister of Education, Minister for Immigration',
      type: 'electorate',
      electorate: 'East Coast Bays',
      political_spectrum: 'centre-right',
      career_before_politics: ['Teacher and school principal'],
      career_in_politics: ['MP for East Coast Bays since 2017', 'Minister of Education and Immigration since November 2023'],
      key_positions: ['Structured literacy and phonics-based reading curriculum reform', 'Mandatory maths and reading testing', 'Tighter immigration settings'],
      accomplishments: ['Led major literacy curriculum overhaul — structured literacy rollout nationally', 'Polled as one of most preferred alternative National leaders in 2025'],
      controversies: ['Immigration processing delays and backlogs during her tenure', 'Cuts to ESOL (English for Speakers of Other Languages) funding criticised'],
    },
    {
      name: 'Simeon Brown',
      role: 'Minister of Transport, Minister of Local Government',
      type: 'electorate',
      electorate: 'Pakuranga',
      political_spectrum: 'centre-right (conservative wing)',
      career_before_politics: ['Political staffer and Young Nationals activist'],
      career_in_politics: ['MP for Pakuranga since 2020', 'Minister of Transport and Local Government since November 2023'],
      key_positions: ['Roads and highway investment over public transport', 'Reversing Auckland light rail and Let\'s Get Wellington Moving projects', 'Reducing local government spending'],
      accomplishments: ['Cancelled Auckland light rail project', 'Fast-tracked road of national significance projects'],
      controversies: ['Strong opposition to public transport investment despite Auckland congestion', 'Considered one of the most conservative members of cabinet'],
    },
    {
      name: 'Mark Mitchell',
      role: 'Minister of Police',
      type: 'electorate',
      electorate: 'Whangaparāoa',
      political_spectrum: 'centre-right',
      career_before_politics: ['Police officer', 'Private security contractor including in Iraq'],
      career_in_politics: ['MP for Rodney/Whangaparāoa since 2011', 'Minister of Police since November 2023'],
      key_positions: ['Tougher policing and sentencing', 'Gang legislation — gang patch bans and organised crime crackdown', 'Firearms law reform'],
      accomplishments: ['Introduced gang patch ban legislation', 'Increased police funding and recruitment targets'],
      controversies: ['Gang patch ban criticised by civil liberties advocates as ineffective and rights-infringing', 'Past work as private military contractor in conflict zones drew scrutiny'],
    },
    {
      name: 'Louise Upston',
      role: 'Minister for Social Development and Employment',
      type: 'electorate',
      electorate: 'Taupō',
      political_spectrum: 'centre-right',
      career_before_politics: ['Business background in tourism and hospitality'],
      career_in_politics: ['MP for Taupō since 2008', 'Minister for Social Development and Employment since November 2023'],
      key_positions: ['Reducing welfare dependency', 'Work obligations for beneficiaries', 'Cutting benefit levels for those who don\'t meet obligations'],
      accomplishments: ['Introduced stricter work-testing requirements for welfare recipients'],
      controversies: ['Welfare cuts criticised by anti-poverty advocates as punitive', 'Drug testing for beneficiaries policy drew significant public debate'],
    },
    {
      name: 'Paul Goldsmith',
      role: 'Minister of Justice, Minister for Arts Culture and Heritage',
      type: 'electorate',
      electorate: 'Epsom',
      political_spectrum: 'centre-right',
      career_before_politics: ['Historian and author', 'Journalist'],
      career_in_politics: ['MP since 2014', 'Minister of Justice since November 2023'],
      key_positions: ['Justice system reform', 'Three-strikes sentencing restoration', 'Treaty of Waitangi principles reform'],
      accomplishments: ['Authored several NZ history books before entering politics', 'Oversaw restoration of three-strikes sentencing law'],
      controversies: ['Released a campaign finance document in 2020 with a significant factual error, claiming New Zealand went into debt to pay for World War II — widely mocked'],
    },
  ],

  labour: [
    {
      name: 'Chris Hipkins',
      role: 'Leader of the Opposition',
      type: 'electorate',
      electorate: 'Remutaka',
      political_spectrum: 'centre-left',
      career_before_politics: ['Student politics — elected VUWSA President twice (2000, 2001)', 'Policy adviser for two Labour education ministers', 'Worked in office of Prime Minister Helen Clark'],
      career_in_politics: ['MP for Remutaka since 2008', 'Minister of Education and Leader of the House 2017–2023', 'Minister of Health and COVID-19 Response 2020–2022', 'Prime Minister January–November 2023', 'Leader of the Opposition since November 2023'],
      key_positions: ['Cost of living focus — workers, housing, health', 'Anti-AUKUS — would not join under his leadership', 'Palestinian statehood recognition', 'NZ Future Fund economic investment policy'],
      accomplishments: ["Led NZ's COVID-19 response as Health Minister — widely praised internationally", "Became PM as consensus candidate after Ardern's resignation", 'Retained leadership after heavy 2023 election defeat', 'Successfully passed several private member\'s bills in opposition'],
      controversies: ['Led Labour to worst MMP-era defeat in 2023 — 65 seats to 34', "Nicknamed 'Chippy' — some critics say his everyman image masks lack of vision", 'Arrested in 1997 during student protest at Parliament — later received compensation and apology', 'Leadership questioned multiple times through 2024–2025 as poll numbers remained low'],
    },
    {
      name: 'Carmel Sepuloni',
      role: 'Deputy Leader of the Opposition',
      type: 'electorate',
      electorate: 'Kelston',
      political_spectrum: 'centre-left',
      career_before_politics: ['Social worker and community advocate', 'University of Auckland — studied social work'],
      career_in_politics: ['MP since 2008', 'Minister of Social Development and Employment 2017–2023', 'Deputy Prime Minister 2023 — first Pasifika person to hold the role', 'Deputy Leader of the Opposition since November 2023'],
      key_positions: ['Social development and poverty reduction', 'Pacific Peoples representation', 'Child poverty reduction'],
      accomplishments: ['First Pasifika Deputy Prime Minister in NZ history', 'Oversaw significant welfare reforms including benefit increases during Labour government'],
      controversies: ['Criticised for welfare system performance during her time as Social Development Minister', 'Some advocates said benefit increases under her watch were insufficient'],
    },
    {
      name: 'Barbara Edmonds',
      role: 'Finance Spokesperson',
      type: 'electorate',
      electorate: 'Mana',
      political_spectrum: 'centre-left',
      career_before_politics: ['Tax lawyer', 'Former Beehive staffer', 'Mother of eight'],
      career_in_politics: ["MP since 2020", "Promoted to Finance spokesperson in 2024 after Grant Robertson's resignation", 'Ranked 4th in Labour caucus'],
      key_positions: ['NZ Future Fund — sovereign wealth fund modelled on Singapore\'s Temasek', 'Progressive taxation', 'Economic investment in New Zealand'],
      accomplishments: ['Rose rapidly through Labour ranks', 'Unveiled NZ Future Fund policy with Hipkins in 2024', 'Widely seen as a future Labour leader'],
      controversies: ['Limited track record as finance spokesperson — still building profile'],
    },
    {
      name: 'Megan Woods',
      role: 'Energy and Resources Spokesperson',
      type: 'electorate',
      electorate: 'Wigram',
      political_spectrum: 'centre-left',
      career_before_politics: ['Academic — PhD in History from University of Canterbury', 'Lecturer at University of Canterbury'],
      career_in_politics: ['MP since 2011', 'Minister of Energy and Resources, Housing, Research, Science and Innovation under Labour government', 'Ranked 4th in caucus during government'],
      key_positions: ['Renewable energy transition', 'Housing supply and affordability', 'Research and science investment'],
      accomplishments: ["One of Labour's most senior and experienced MPs", 'Managed major housing and energy portfolios simultaneously'],
      controversies: ["Housing crisis worsened during Labour's tenure despite her role as Housing Minister", 'Critics questioned effectiveness of housing policies'],
    },
    {
      name: 'Willie Jackson',
      role: 'Māori Development and Māori-Crown Relations Spokesperson',
      type: 'list',
      electorate: null,
      political_spectrum: 'centre-left',
      career_before_politics: ['Prominent broadcaster and media personality', 'Iwi radio and television — co-host of various programmes', 'Community and Māori rights advocate'],
      career_in_politics: ['MP since 2017', 'Minister of Māori Development, Broadcasting and Employment under Labour government', 'Ranked 5th in Labour caucus'],
      key_positions: ['Māori development and self-determination', 'Māori media and broadcasting', 'Employment and workplace relations'],
      accomplishments: ['Long career in Māori broadcasting before politics', 'Senior Māori voice within Labour caucus'],
      controversies: ['Made controversial comments defending a former colleague accused of sexual harassment in 2018 — widely criticised', 'Has clashed publicly with Te Pāti Māori over representation of Māori interests'],
    },
    {
      name: 'Kieran McAnulty',
      role: 'Housing and Local Government Spokesperson, Shadow Leader of the House',
      type: 'electorate',
      electorate: 'Wairarapa',
      political_spectrum: 'centre-left',
      career_before_politics: ['Local government — Masterton District Councillor', 'Business background in the Wairarapa region'],
      career_in_politics: ['MP for Wairarapa since 2020', 'Minister for Emergency Management during Auckland floods and Cyclone Gabrielle 2023', 'Shadow Leader of the House since November 2023'],
      key_positions: ['Housing affordability and supply', 'Regional development', 'Local government'],
      accomplishments: ['Widely praised for handling of 2023 Auckland Anniversary Weekend floods and Cyclone Gabrielle response', "One of Labour's most popular and high-profile MPs", 'Seen as a future leader of the Labour Party'],
      controversies: ["Limited controversies — one of Labour's cleanest political profiles"],
    },
    {
      name: 'Ayesha Verrall',
      role: 'Health Spokesperson',
      type: 'list',
      electorate: null,
      political_spectrum: 'centre-left',
      career_before_politics: ['Medical doctor — infectious disease specialist', 'Public health researcher at University of Otago Wellington'],
      career_in_politics: ['MP since 2020', 'Minister of Health and Food Safety under Labour government', 'Health spokesperson in opposition since 2023'],
      key_positions: ['Public health system investment', 'Preventive health and primary care', 'Pandemic preparedness'],
      accomplishments: ['Brought medical expertise directly to health portfolio', 'Oversaw establishment of Te Whatu Ora (Health NZ) under Labour'],
      controversies: ['Te Whatu Ora was placed under a commissioner by the incoming National government citing financial mismanagement during its establishment'],
    },
    {
      name: 'Ginny Andersen',
      role: 'Police and Prevention of Family Violence Spokesperson',
      type: 'electorate',
      electorate: 'Hutt South',
      political_spectrum: 'centre-left',
      career_before_politics: ['Community and social sector work', 'Local government involvement'],
      career_in_politics: ['MP since 2017', 'Minister of Police under Labour government', 'Police spokesperson in opposition'],
      key_positions: ['Community policing and prevention', 'Family and sexual violence prevention', 'Treaty of Waitangi negotiations'],
      accomplishments: ['Increased police budget by 35% and police numbers by 15% during her ministerial tenure'],
      controversies: ['Faced bullying allegations from within her office in 2023 — Hipkins stated he had full confidence in her', 'Lost Hutt South electorate to National\'s Chris Bishop in 2023'],
    },
    {
      name: 'Duncan Webb',
      role: 'Justice Spokesperson, Deputy Shadow Leader of the House',
      type: 'electorate',
      electorate: 'Christchurch Central',
      political_spectrum: 'centre-left',
      career_before_politics: ['Lawyer — senior legal practitioner', 'University of Canterbury — law lecturer'],
      career_in_politics: ['MP since 2017', 'Justice spokesperson in opposition', 'Signalled retirement ahead of 2026 election'],
      key_positions: ['Justice system reform', 'Regulation and consumer protection', 'Christchurch earthquake recovery'],
      accomplishments: ["Described as 'forensic' in his scrutiny of legislation", 'Strong legal background brought to justice portfolio'],
      controversies: ['Relatively low public profile'],
    },
    {
      name: 'Camilla Belich',
      role: 'MP, Senior Whip',
      type: 'list',
      electorate: null,
      political_spectrum: 'centre-left',
      career_before_politics: ['Lawyer'],
      career_in_politics: ['MP since 2020', 'Senior Whip', 'Passed private member\'s bill in 2025 making wage theft by employers a criminal offence'],
      key_positions: ['Workers rights', 'Employment law', "Women's rights"],
      accomplishments: ['Crimes (Theft By Employer) Amendment Bill passed March 2025 — landmark workers rights legislation'],
      controversies: ['Limited controversies'],
    },
  ],

  act: [
    {
      name: 'David Seymour',
      role: 'Deputy Prime Minister, Minister for Regulation',
      type: 'electorate',
      electorate: 'Epsom',
      political_spectrum: 'libertarian-right',
      career_before_politics: ['Electrical engineer', 'Worked for conservative think tanks in Canada', 'Involved in legislation enabling Partnership (Charter) Schools'],
      career_in_politics: ["MP for Epsom since 2014 — entered as ACT's sole MP", 'Leader of ACT since 2014', 'Parliamentary Under-Secretary under John Key government', 'Deputy Prime Minister from May 2025 (shared role with Winston Peters until then)', 'Minister for Regulation since 2023 — first ever holder of this portfolio'],
      key_positions: ['Free market economics and reduced government', 'Treaty Principles Bill — redefine Treaty of Waitangi principles via referendum', 'Charter schools and education choice', 'Individual freedom and personal responsibility', 'Reduce Parliament from 120 to 100 MPs'],
      accomplishments: ['Passed End of Life Choice Act — landmark euthanasia legislation after years of advocacy', 'Grew ACT from 1 seat in 2014 to 11 seats in 2023', 'Passed Regulatory Standards Act 2025', "Appeared on Dancing with the Stars — finished 5th", "Raised $60,000 for Prostate Cancer Foundation with Jacinda Ardern after she told him to 'go home'"],
      controversies: ['Treaty Principles Bill sparked nationwide protests and a parliamentary haka — voted down 11-112 in April 2025', 'Publicly contradicted PM Luxon multiple times — tensions within coalition', 'Instructed Pharmac to stop considering Treaty of Waitangi in decisions', 'Cancelled school lunch programme review — critics argued it harmed low-income children', 'Has partial Māori ancestry but opposes Māori co-governance arrangements'],
    },
    {
      name: 'Brooke van Velden',
      role: 'Deputy Leader, Minister for Workplace Relations and Safety, Minister for Internal Affairs',
      type: 'electorate',
      electorate: 'Tāmaki',
      political_spectrum: 'libertarian-right',
      career_before_politics: ['Policy analyst and political advisor', 'University of Auckland graduate'],
      career_in_politics: ['List MP since 2020', 'Won Tāmaki electorate in 2023', 'Deputy Leader of ACT since 2020', 'Minister for Workplace Relations and Safety since 2023'],
      key_positions: ['Workplace flexibility and reduced employment regulation', '90-day no-cause eviction trial periods — reinstated under her watch', 'Individual employment contracts over collective bargaining'],
      accomplishments: ['First ACT MP to win Tāmaki electorate', 'Reinstated 90-day no-cause evictions for tenants', 'Scrapped Fair Pay Agreements introduced by Labour'],
      controversies: ['Fair Pay Agreement repeal criticised by unions as stripping worker protections', '90-day eviction policy criticised by housing advocates as harmful to renters'],
    },
    {
      name: 'Nicole McKee',
      role: 'Associate Minister of Justice, Associate Minister of Police',
      type: 'list',
      electorate: null,
      political_spectrum: 'libertarian-right',
      career_before_politics: ['CEO of the Council of Licensed Firearms Owners (COLFO)', 'Prominent firearms rights advocate'],
      career_in_politics: ['List MP since 2020', 'Ranked 3rd on ACT list', 'Associate Minister of Justice and Police since 2023'],
      key_positions: ['Firearms law reform — rollback of post-Christchurch attack restrictions', 'Law and order', 'Individual rights'],
      accomplishments: ["Led ACT's firearms policy work", "Advocate for licensed firearms owners' rights"],
      controversies: ['Push to soften firearms laws following Christchurch mosque attacks drew significant criticism from survivors and victim advocates', 'Background as firearms lobby CEO seen as conflict of interest by critics'],
    },
    {
      name: 'Todd Stephenson',
      role: 'MP',
      type: 'list',
      electorate: null,
      political_spectrum: 'libertarian-right',
      career_before_politics: ['Health industry professional', 'Based in Southland'],
      career_in_politics: ['List MP since 2023 — new entrant ranked 4th on ACT list'],
      key_positions: ['Health system efficiency', 'Regional economic development', 'Reduced regulation'],
      accomplishments: ["Entered Parliament as one of ACT's new 2023 intake"],
      controversies: ['Limited public profile as a first-term MP'],
    },
    {
      name: 'Andrew Hoggard',
      role: 'MP, Associate Minister of Agriculture',
      type: 'list',
      electorate: null,
      political_spectrum: 'libertarian-right',
      career_before_politics: ['Farmer', 'President of Federated Farmers of New Zealand'],
      career_in_politics: ['List MP since 2023 — ranked 5th on ACT list', 'Associate Minister of Agriculture'],
      key_positions: ['Reducing agricultural regulation', 'Farmer rights and rural communities', 'Rollback of freshwater and emissions regulations on farming'],
      accomplishments: ['Brought significant farming sector credibility to ACT caucus', 'Former Federated Farmers president — well-known in rural NZ'],
      controversies: ['Environmental advocates criticise his push to weaken freshwater regulations protecting waterways from agricultural runoff'],
    },
    {
      name: 'Karen Chhour',
      role: 'Minister for Children (Oranga Tamariki)',
      type: 'list',
      electorate: null,
      political_spectrum: 'libertarian-right',
      career_before_politics: ['Former state care recipient — personal experience with Oranga Tamariki system', 'Community advocate'],
      career_in_politics: ['List MP since 2020', 'Ranked 6th on ACT list in 2023', 'Minister for Children since 2023'],
      key_positions: ['Oranga Tamariki reform', 'Child protection system overhaul', 'Reducing ideology-driven policy in child welfare'],
      accomplishments: ['Brought lived experience of state care to the children\'s portfolio', 'Oversaw significant reforms to Oranga Tamariki'],
      controversies: ['Proposed removing Section 7AA of the Oranga Tamariki Act — a provision requiring the agency to give effect to Treaty of Waitangi principles — drew strong opposition from Māori groups and child advocates', 'Critics argued her reforms risk harming Māori children disproportionately in the care system'],
    },
    {
      name: 'Mark Cameron',
      role: 'MP',
      type: 'list',
      electorate: null,
      political_spectrum: 'libertarian-right',
      career_before_politics: ['Farmer and rural business owner'],
      career_in_politics: ['List MP since 2020', 'Ranked 7th on ACT list in 2023'],
      key_positions: ['Rural communities', 'Farming and agricultural deregulation', 'Property rights'],
      accomplishments: ['Consistent rural voice within ACT caucus'],
      controversies: ['Limited public profile'],
    },
    {
      name: 'Simon Court',
      role: 'MP',
      type: 'list',
      electorate: null,
      political_spectrum: 'libertarian-right',
      career_before_politics: ['Engineer and environmental consultant'],
      career_in_politics: ['List MP since 2020', 'Ranked 8th on ACT list in 2023'],
      key_positions: ['Resource Management Act reform', 'Reducing environmental regulatory burden', 'Infrastructure development'],
      accomplishments: ['Active in RMA reform select committee work'],
      controversies: ["Referred to Parliament's Privileges Committee in 2023 for leaking confidential select committee vote — found to have committed a clear breach and apologised"],
    },
  ],

  greens: [
    {
      name: 'Chlöe Swarbrick',
      role: 'Co-Leader, MP for Auckland Central',
      type: 'electorate',
      electorate: 'Auckland Central',
      political_spectrum: 'left-environmentalist',
      career_before_politics: ['Digital consultancy and artist management agency TIPS (co-founded with Bartley Catt)', "Opened café and gallery 'Olly' in Mount Eden, Auckland", 'Ran for Auckland Mayor in 2016 — came third'],
      career_in_politics: ['List MP since 2017 — youngest MP at the time at age 23', 'Won Auckland Central electorate in 2020 — only second Green MP ever to win an electorate', 'Retained Auckland Central in 2023', 'Co-Leader of the Green Party since March 2024'],
      key_positions: ['Climate change and bold emissions reduction', 'Wealth tax and income inequality', 'Drug law reform', 'Mental health system investment', "Israel sanctions — member's bill submitted December 2024", 'Green Budget — $8 billion four-year investment in green infrastructure'],
      accomplishments: ["Famous 'OK Boomer' moment in Parliament went viral globally", 'Won Auckland Central — first Green electorate MP to hold seat for more than one term', "Named to Fortune '40 Under 40' in 2020", 'Won Jane Goodall Trailblazer Award 2019', 'Unveiled Green alternative budget proposing 40,000 jobs through Ministry of Green Works'],
      controversies: ['Removed from Parliament by Speaker Brownlee in August 2025 for criticising government MPs — refused to apologise and was suspended again', 'Apologised to Parliament in 2024 after accusing PM Luxon of lying in the debating chamber — breach of parliamentary rules', 'Israel sanctions bill was politically contentious'],
    },
    {
      name: 'Marama Davidson',
      role: 'Co-Leader, List MP',
      type: 'list',
      electorate: null,
      political_spectrum: 'left-environmentalist',
      career_before_politics: ['Community activist and social justice advocate', 'Involved in Gaza Freedom Flotilla 2011'],
      career_in_politics: ['List MP since 2017', 'Co-Leader of the Green Party since 2018', 'Minister for the Prevention of Family and Sexual Violence 2020–2023'],
      key_positions: ['Family and sexual violence prevention', 'Māori and Pasifika rights', 'Social justice and poverty elimination', 'Treaty of Waitangi'],
      accomplishments: ['First Māori woman to lead a NZ political party', 'Ministerial role focused on family violence prevention'],
      controversies: ["Made controversial comments in 2023 attributing violence against women to 'white cis men' shortly after being hit by a car at a protest — widely criticised across political spectrum", 'Comments led to significant public debate about her suitability as co-leader'],
    },
    {
      name: 'Julie Anne Genter',
      role: 'MP for Rongotai',
      type: 'electorate',
      electorate: 'Rongotai',
      political_spectrum: 'left-environmentalist',
      career_before_politics: ['Transport planner and urban mobility consultant', 'Born in the United States — moved to New Zealand', "Master's degree in City Planning from UC Berkeley"],
      career_in_politics: ['List MP since 2011', 'Won Rongotai electorate in 2023 — second Green electorate MP', 'Associate Minister of Transport and Minister for Women 2017–2020'],
      key_positions: ['Public transport and active travel', 'Urban planning and housing density', "Women's rights", 'Climate policy'],
      accomplishments: ['Won Rongotai electorate in 2023 — expanded Green electorate presence', 'Leading voice on transport and urban policy in NZ', 'Gave birth in Parliament — brought global attention to parental rights in legislatures'],
      controversies: ['Cycling to hospital while in labour drew widespread media attention — she defended it as a personal choice'],
    },
    {
      name: 'Tamatha Paul',
      role: 'MP for Wellington Central',
      type: 'electorate',
      electorate: 'Wellington Central',
      political_spectrum: 'left-environmentalist',
      career_before_politics: ['Wellington City Councillor', 'Community organiser and activist'],
      career_in_politics: ['Wellington City Councillor before entering Parliament', 'Won Wellington Central electorate in 2023 — third Green electorate MP'],
      key_positions: ['Housing affordability', 'Urban issues', 'Climate action', 'Social justice'],
      accomplishments: ['Won Wellington Central — significant gain for Greens', 'Brought local government experience to Parliament'],
      controversies: ['Limited controversies as a first-term MP'],
    },
    {
      name: 'Ricardo Menéndez March',
      role: 'List MP, Social Development and Employment Spokesperson',
      type: 'list',
      electorate: null,
      political_spectrum: 'left-environmentalist',
      career_before_politics: ['Anti-poverty campaigner', 'Born in Tijuana, Mexico — first Latin American MP in NZ history', 'Community organiser focused on migrant workers and welfare'],
      career_in_politics: ['List MP since 2020', 'Led campaigns to end benefit sanctions and lift incomes', 'Social development and employment spokesperson'],
      key_positions: ['Welfare system reform — end benefit sanctions', 'Migrant worker protections', 'Income adequacy and poverty elimination', 'Guaranteed minimum income'],
      accomplishments: ['First Latin American MP in NZ history', 'Successfully campaigned for benefit sanctions reform', "Strong advocate for migrant workers' rights"],
      controversies: ["Shane Jones made remarks about 'sending Mexicans home' targeting Menéndez March — widely condemned as racist", "Peters and Jones criticised him for referring to NZ as 'Aotearoa' in Parliament", "His tweet 'From the river to the sea, Palestine will be free' was cited by ACT as reason to oppose a Green Palestine motion"],
    },
    {
      name: 'Teanau Tuiono',
      role: 'List MP, Pacific spokesperson',
      type: 'list',
      electorate: null,
      political_spectrum: 'left-environmentalist',
      career_before_politics: ['Over 20 years as activist, advocate and organiser at local, national and international levels', 'Cook Islander — first Pasifika Green MP'],
      career_in_politics: ['List MP since 2020', 'First Pasifika Green MP'],
      key_positions: ['Pacific peoples and climate change', 'Indigenous rights', 'Environment and conservation'],
      accomplishments: ['First Pasifika MP for the Green Party', 'Long activist background before entering Parliament'],
      controversies: ["Winston Peters criticised him for referring to NZ as 'Aotearoa' in Parliament in February 2026 — Speaker cautioned Peters"],
    },
    {
      name: 'Lan Pham',
      role: 'List MP',
      type: 'list',
      electorate: null,
      political_spectrum: 'left-environmentalist',
      career_before_politics: ['Of Vietnamese and Pākehā heritage', 'Community and environmental work in Christchurch'],
      career_in_politics: ['List MP since 2023 — new entrant', 'First MP with Vietnamese heritage in NZ history'],
      key_positions: ['Environment and climate', 'Multicultural representation', 'Community wellbeing'],
      accomplishments: ['First MP with Vietnamese heritage in NZ history'],
      controversies: ['Limited public profile as first-term MP'],
    },
    {
      name: 'Steve Abel',
      role: 'List MP',
      type: 'list',
      electorate: null,
      political_spectrum: 'left-environmentalist',
      career_before_politics: ['Long-time environment and climate activist', 'Successful advocacy campaigns to end native logging and protect forests'],
      career_in_politics: ['List MP since 2023 — new entrant'],
      key_positions: ['Native forest protection', 'Climate action', 'Conservation'],
      accomplishments: ['Decades of environmental activism before entering Parliament', 'Led campaigns ending native logging'],
      controversies: ['Limited parliamentary controversies as first-term MP'],
    },
    {
      name: 'Lawrence Xu-Nan',
      role: 'List MP',
      type: 'list',
      electorate: null,
      political_spectrum: 'left-environmentalist',
      career_before_politics: ['Academic and community advocate', 'Of Chinese heritage'],
      career_in_politics: ['Entered Parliament in 2024 replacing Efeso Collins who died in February 2024'],
      key_positions: ['Multicultural representation', 'Social justice', 'Climate policy'],
      accomplishments: ['Brought diverse ethnic representation to Green caucus'],
      controversies: ["Winston Peters accused him of seeking to impose 'foreign ideas' on New Zealanders — widely condemned as xenophobic"],
    },
    {
      name: 'Francisco Hernandez',
      role: 'List MP',
      type: 'list',
      electorate: null,
      political_spectrum: 'left-environmentalist',
      career_before_politics: ['Community organiser'],
      career_in_politics: ['Entered Parliament in May 2024 replacing James Shaw who resigned'],
      key_positions: ['Social justice', 'Migrant communities', 'Environment'],
      accomplishments: ['Entered Parliament as part of Green caucus renewal in 2024'],
      controversies: ["Winston Peters accused him of seeking to impose 'foreign ideas' on New Zealanders — condemned as xenophobic by Labour and Greens"],
    },
  ],

  nzfirst: [
    {
      name: 'Winston Peters',
      role: 'Leader, Minister of Foreign Affairs',
      type: 'list',
      electorate: null,
      political_spectrum: 'populist-nationalist',
      career_before_politics: ['Lawyer — University of Otago law graduate', 'National Party MP for Tauranga from 1984', "Minister of Māori Affairs under Jim Bolger's National government"],
      career_in_politics: ['MP since 1984 — one of NZ\'s longest-serving politicians', 'Founded New Zealand First in 1993 after being expelled from National', 'Deputy PM and Treasurer 1996–1998 in coalition with National', 'Deputy PM 2017–2020 in coalition with Labour', 'Deputy PM until May 2025 in coalition with National and ACT', 'Minister of Foreign Affairs since 2023'],
      key_positions: ['NZ sovereignty and anti-globalism', 'Superannuation protection — oppose raising retirement age', 'Controlled immigration and migrant values statements', 'Referendum to abolish Māori electorates', 'Compulsory 10% KiwiSaver contributions', 'English as an official language of New Zealand'],
      accomplishments: ['Kingmaker in multiple elections — only party to have governed with both National and Labour under MMP', 'Led NZ First back from political oblivion after 2020 wipeout', 'Secured significant regional development and infrastructure funding in coalition deals', 'Negotiated NZ$461 million rail network upgrade as Foreign Affairs Minister', 'Resumed NZ funding to UNRWA despite coalition tensions'],
      controversies: ['Made remarks targeting Green MPs from migrant backgrounds — accused of racism by Labour and Greens in 2025', "Repeatedly criticised use of Māori language 'Aotearoa' in Parliament", 'Publicly undercut Finance Minister Nicola Willis by claiming tax cuts created a $5.6b fiscal hole', "Used 'agree to disagree' clause over immigration residency pathways — destabilised coalition", 'Long history of political controversy spanning four decades', 'Opposed use of te reo Māori in public life throughout his career'],
    },
    {
      name: 'Shane Jones',
      role: 'Deputy Leader, Minister for Regional Development, Oceans and Fisheries, Resources',
      type: 'electorate',
      electorate: 'Northland',
      political_spectrum: 'populist-nationalist',
      career_before_politics: ['Lawyer and businessman', 'Pacific Economic Ambassador — appointed 2014 after leaving Labour'],
      career_in_politics: ['Labour list MP 2005–2014', 'Contested Labour leadership in 2013 — lost to David Cunliffe', 'NZ First MP 2017–2020', 'NZ First MP for Northland since 2023', 'Deputy Leader of NZ First since September 2025', 'Minister for Regional Development, Oceans and Fisheries, Resources since 2023'],
      key_positions: ['Regional economic development — roads, infrastructure, industry', 'Fishing and ocean resource management', 'Resource extraction — mining, oil and gas', 'Anti-co-governance', 'Immigration control'],
      accomplishments: ['Provincial Growth Fund — directed billions to regional NZ during 2017–2020 Labour coalition', 'Senior voice for Northland and regional NZ', 'Elected Deputy Leader unanimously by NZ First caucus in 2025'],
      controversies: ["Made remarks about 'sending Mexicans home' targeting Green MP Ricardo Menéndez March — widely condemned as racist", "Accused Green MPs Lawrence Xu-Nan and Francisco Hernandez of imposing 'foreign ideas' on NZ", 'Described as deliberately provocative and inflammatory in parliamentary debates', 'Crossed the floor from Labour to NZ First — seen by some as opportunistic', 'Past allegations regarding use of parliamentary credit card while a Labour MP'],
    },
    {
      name: 'Casey Costello',
      role: 'Minister for Customs, Associate Minister of Health, Associate Minister of Immigration',
      type: 'list',
      electorate: null,
      political_spectrum: 'populist-nationalist',
      career_before_politics: ['Detective Sergeant in NZ Police', 'Vice President of the Police Association — first woman elected to this role', "Founding trustee of Hobson's Pledge — opposes co-governance", 'Former chairperson and board member of the NZ Taxpayers\' Union'],
      career_in_politics: ['List MP since 2023 — new entrant ranked 3rd on NZ First list', 'Associate Minister of Health and Immigration since 2023'],
      key_positions: ['Opposition to co-governance and Māori-specific policy', 'Law and order', 'Immigration control', 'Customs and border security'],
      accomplishments: ['Brought police and law enforcement background to Parliament', 'Senior NZ First voice on health and immigration policy'],
      controversies: ["Founding trustee of Hobson's Pledge — an organisation widely criticised for its opposition to Māori rights", 'Former Taxpayers\' Union board member — seen as conflict of interest with ministerial role', 'Has Ngāpuhi/Ngāti Wai Māori ancestry but actively opposes co-governance arrangements'],
    },
    {
      name: 'Mark Patterson',
      role: 'MP, Associate Minister of Agriculture',
      type: 'list',
      electorate: null,
      political_spectrum: 'populist-nationalist',
      career_before_politics: ['Beef and sheep farmer in Otago', 'Otago Federated Farmers chair'],
      career_in_politics: ['List MP 2017–2020', 'Returned as list MP in 2023 — ranked 4th on NZ First list', 'Associate Minister of Agriculture'],
      key_positions: ['Agricultural deregulation', 'Farmer rights and rural communities', 'Reducing environmental compliance costs for farmers'],
      accomplishments: ['Consistent voice for South Island farming communities', 'Brought practical farming knowledge to agricultural policy'],
      controversies: ['Switched from National to NZ First after Silver Fern Farms sale to Chinese buyers in 2016'],
    },
    {
      name: 'Jenny Marcroft',
      role: 'MP',
      type: 'list',
      electorate: null,
      political_spectrum: 'populist-nationalist',
      career_before_politics: ['30 years in radio and television broadcasting', 'Worked in health sector after first parliamentary stint', 'Worked for Auckland Mayor Wayne Brown'],
      career_in_politics: ['List MP 2017–2020 — first stint', 'Resigned from NZ First after 2020 defeat citing cultural issues', 'Returned as list MP in 2023 — ranked 5th on NZ First list'],
      key_positions: ['Broadcasting and media', 'Health sector', 'Regional representation'],
      accomplishments: ['Long broadcasting career including early advocacy for correct Māori language pronunciation on air', 'Ngāpuhi wahine bringing Māori perspective to NZ First'],
      controversies: ['Resigned from NZ First after 2020 defeat citing internal cultural issues — then rejoined for 2023'],
    },
    {
      name: 'Jamie Arbuckle',
      role: 'MP',
      type: 'list',
      electorate: null,
      political_spectrum: 'populist-nationalist',
      career_before_politics: ['Military background — army officer'],
      career_in_politics: ['List MP since 2023 — ranked 6th on NZ First list, new entrant'],
      key_positions: ['Defence and national security', 'Law and order'],
      accomplishments: ['Brought military background to NZ First caucus'],
      controversies: ['Limited public profile as first-term MP'],
    },
    {
      name: 'Andy Foster',
      role: 'MP',
      type: 'list',
      electorate: null,
      political_spectrum: 'populist-nationalist',
      career_before_politics: ['Mayor of Wellington 2019–2022', 'Wellington City Councillor for many years before becoming mayor'],
      career_in_politics: ['List MP since 2023 — ranked 7th on NZ First list, new entrant'],
      key_positions: ['Local government and urban issues', 'Infrastructure', 'Wellington regional interests'],
      accomplishments: ['Former Wellington Mayor — brought significant local government experience to Parliament'],
      controversies: ['Lost Wellington mayoral race in 2022 to Tory Whanau'],
    },
    {
      name: 'Tanya Unkovich',
      role: 'MP',
      type: 'list',
      electorate: null,
      political_spectrum: 'populist-nationalist',
      career_before_politics: ['Anti-COVID restrictions campaigner', 'Community activist'],
      career_in_politics: ['List MP since 2023 — ranked 8th on NZ First list, new entrant'],
      key_positions: ['Individual freedoms', 'Scepticism of government mandates'],
      accomplishments: ["Entered Parliament as part of NZ First's 2023 comeback"],
      controversies: ['Background as anti-COVID restrictions campaigner drew scrutiny', 'Limited parliamentary profile'],
    },
  ],
};

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌿 Fair Say NZ — Supabase seed ${DRY_RUN ? '(DRY RUN)' : ''}\n`);

  if (!DRY_RUN) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }

  // ── Parties ──
  console.log(`📦 Seeding ${PARTIES.length} parties…`);
  if (!DRY_RUN) {
    const { error } = await supabase
      .from('parties')
      .upsert(PARTIES, { onConflict: 'slug' });
    if (error) { console.error('❌ Parties failed:', error.message); process.exit(1); }
  } else {
    PARTIES.forEach((p) => console.log(`   [dry] ${p.name}`));
  }
  console.log(`   ✓ ${PARTIES.length} parties done\n`);

  // ── MPs ──
  if (!DRY_RUN) {
    // Fetch party UUIDs keyed by slug
    const { data: partyRows, error: pErr } = await supabase
      .from('parties')
      .select('id, slug');
    if (pErr) { console.error('❌ Could not fetch parties:', pErr.message); process.exit(1); }
    const partyIdBySlug = Object.fromEntries(partyRows.map((p) => [p.slug, p.id]));

    for (const [partySlug, mps] of Object.entries(MPS_BY_PARTY)) {
      const party_id = partyIdBySlug[partySlug];
      if (!party_id) { console.warn(`⚠️  Party not found for slug '${partySlug}' — skipping`); continue; }

      console.log(`📦 Seeding ${mps.length} MPs for ${partySlug}…`);
      const rows = mps.map((mp) => ({
        name: mp.name,
        full_name: mp.name,
        slug: slugify(mp.name),
        party_id,
        party_name: partySlug,
        role: mp.role || 'MP',
        type: mp.type || 'list',
        electorate: mp.electorate || null,
        political_spectrum: mp.political_spectrum || null,
        career_before_politics: mp.career_before_politics || [],
        career_in_politics: mp.career_in_politics || [],
        key_positions: mp.key_positions || [],
        accomplishments: mp.accomplishments || [],
        controversies: mp.controversies || [],
        is_active: true,
      }));

      const { error } = await supabase
        .from('mps')
        .upsert(rows, { onConflict: 'slug' });
      if (error) { console.error(`❌ MPs for ${partySlug} failed:`, error.message); process.exit(1); }
      rows.forEach((mp) => console.log(`   ✓ ${mp.full_name}`));
    }
  } else {
    for (const [partySlug, mps] of Object.entries(MPS_BY_PARTY)) {
      console.log(`📦 [dry] ${mps.length} MPs for ${partySlug}:`);
      mps.forEach((mp) => console.log(`   [dry] ${mp.name}`));
    }
  }

  const totalMPs = Object.values(MPS_BY_PARTY).reduce((n, arr) => n + arr.length, 0);
  console.log(`\n🎉 Done! Seeded ${PARTIES.length} parties and ${totalMPs} MPs.\n`);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
