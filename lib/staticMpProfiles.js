// Rich profile data for static MPs, keyed by slug.
// Rendered on /mps/[slug] when the database is not seeded.

const MP_PROFILES = {

  // ── National ───────────────────────────────────────────────────────────────

  'christopher-luxon': {
    career_before_politics: ['Joined Unilever 1993 — rose to President and CEO of Unilever Canada', 'CEO of Air New Zealand 2013–2019'],
    career_in_politics: ['MP for Botany since 2020', 'Leader of the Opposition 2021–2023', 'Prime Minister since November 2023'],
    key_positions: ['Lower taxes and reduced public spending', 'Economic growth through business investment', 'Reduced Treaty of Waitangi provisions in legislation', 'Law and order — reinstated three-strikes sentencing'],
    accomplishments: ['Led National to victory in 2023 election', "Formed NZ's first formal three-party coalition government", 'Delivered NZ$14.7 billion in tax cuts', 'Reduced public service headcount significantly'],
    controversies: ['Criticised for using taxpayer funds for te reo lessons then discouraging te reo use in public service as PM', 'Coalition seen as unstable — Seymour and Peters have publicly contradicted him', 'Presided over a prolonged recession with economists criticising his economic approach', 'Leadership questioned within caucus through 2025'],
  },

  'nicola-willis': {
    career_before_politics: ['Political advisor and corporate lobbyist', 'First-class honours in English Literature, Victoria University of Wellington'],
    career_in_politics: ['List MP from 2018', 'MP for Ōhāriu since 2020', 'Deputy Leader of National since 2021', 'Minister of Finance since November 2023'],
    key_positions: ['Fiscal responsibility and reduced government spending', 'Tax relief for working families', 'Social investment approach to welfare'],
    accomplishments: ['Delivered major tax cut package in 2024', 'First Minister for Economic Growth appointed January 2025', 'Managed significant public service restructuring'],
    controversies: ['Tax cut plan criticised for creating a $5.6b fiscal hole', 'Admitted only 3,000 households would receive full tax relief', 'Group of 15 economists wrote open letter condemning her policies as harmful to the poorest New Zealanders'],
  },

  'chris-bishop': {
    career_before_politics: ['Lobbyist for tobacco company Philip Morris', 'Member of NZ Youth Parliament 2000'],
    career_in_politics: ["MP for Hutt South", "Chairperson of National's 2023 Election Campaign", 'Minister of Housing, Infrastructure, RMA Reform and Leader of the House 2023–2026', 'Attorney-General from April 2026'],
    key_positions: ['Significant housing supply reform', 'RMA (Resource Management Act) overhaul', 'Tougher state housing tenancy rules'],
    accomplishments: ["Named 'Politician of the Year' by The Post in 2025", "'Minister for everything' — outsized influence in government", 'Led major RMA reform legislation'],
    controversies: ['Former lobbyist for Philip Morris tobacco company', "Filmed calling a Māori cultural performance 'a load of crap' at 2025 Aotearoa Music Awards", 'Reported to have attempted to gather support to challenge Luxon for leadership in late 2025', 'State housing eviction policy criticised as vindictive'],
  },

  'shane-reti': {
    career_before_politics: ['Medical doctor and GP', 'Served rural Northland communities'],
    career_in_politics: ['MP for Whangārei since 2017', 'Served as interim National Party leader briefly in 2021', 'Minister of Health since November 2023'],
    key_positions: ['Health system reform and efficiency', 'Reducing health bureaucracy', 'Rural health access'],
    accomplishments: ['Oversaw dismantling of Te Whatu Ora (Health NZ) structure', 'Brought medical professional background directly to the health portfolio'],
    controversies: ['Health NZ placed under commissioner in 2024 amid financial crisis and significant job losses', 'Presided over major cuts to the health workforce'],
  },

  'judith-collins': {
    career_before_politics: ['Lawyer'],
    career_in_politics: ['MP for Papakura since 2002', 'Mother of the House — longest-serving female MP', 'Leader of the National Party 2020–2021', 'Multiple ministerial roles including Justice, Police, Corrections', 'Minister for National Security and Intelligence since 2023'],
    key_positions: ['Law and order hardliner', 'Strong national security stance', 'Sceptic of co-governance'],
    accomplishments: ['One of the longest-serving MPs in NZ history', 'Held major portfolios across multiple National governments'],
    controversies: ["Nicknamed 'Crusher Collins' for proposing to crush boy racers' cars", 'Ousted as National leader in 2021 after internal caucus crises', 'Demoted and reinstated multiple times during internal party conflicts'],
  },

  'erica-stanford': {
    career_before_politics: ['Teacher and school principal'],
    career_in_politics: ['MP for East Coast Bays since 2017', 'Minister of Education and Immigration since November 2023'],
    key_positions: ['Structured literacy and phonics-based reading curriculum reform', 'Mandatory maths and reading testing', 'Tighter immigration settings'],
    accomplishments: ['Led major national literacy curriculum overhaul — structured literacy rollout', 'Polled as one of most preferred alternative National leaders in 2025'],
    controversies: ['Immigration processing delays and backlogs during her tenure', 'Cuts to ESOL (English for Speakers of Other Languages) funding criticised'],
  },

  'simeon-brown': {
    career_before_politics: ['Political staffer and Young Nationals activist'],
    career_in_politics: ['MP for Pakuranga since 2020', 'Minister of Transport and Local Government since November 2023'],
    key_positions: ['Roads and highway investment over public transport', 'Reversing Auckland light rail and Let\'s Get Wellington Moving projects', 'Reducing local government spending'],
    accomplishments: ['Cancelled Auckland light rail project', 'Fast-tracked road of national significance projects'],
    controversies: ['Strong opposition to public transport investment despite Auckland congestion', 'Considered one of the most conservative members of cabinet'],
  },

  'mark-mitchell': {
    career_before_politics: ['Police officer', 'Private security contractor including in Iraq'],
    career_in_politics: ['MP for Rodney/Whangaparāoa since 2011', 'Minister of Police since November 2023'],
    key_positions: ['Tougher policing and sentencing', 'Gang legislation — gang patch bans and organised crime crackdown', 'Firearms law reform'],
    accomplishments: ['Introduced gang patch ban legislation', 'Increased police funding and recruitment targets'],
    controversies: ['Gang patch ban criticised by civil liberties advocates as ineffective and rights-infringing', 'Past work as private military contractor in conflict zones drew scrutiny'],
  },

  'louise-upston': {
    career_before_politics: ['Business background in tourism and hospitality'],
    career_in_politics: ['MP for Taupō since 2008', 'Minister for Social Development and Employment since November 2023'],
    key_positions: ['Reducing welfare dependency', 'Work obligations for beneficiaries', 'Cutting benefits for those who don\'t meet obligations'],
    accomplishments: ['Introduced stricter work-testing requirements for welfare recipients'],
    controversies: ['Welfare cuts criticised by anti-poverty advocates as punitive', 'Drug testing for beneficiaries policy drew significant public debate'],
  },

  'paul-goldsmith': {
    career_before_politics: ['Historian and author', 'Journalist'],
    career_in_politics: ['MP since 2014', 'Minister of Justice since November 2023'],
    key_positions: ['Justice system reform', 'Three-strikes sentencing restoration', 'Treaty of Waitangi principles reform'],
    accomplishments: ['Authored several NZ history books before entering politics', 'Oversaw restoration of three-strikes sentencing law'],
    controversies: ['Released a 2020 campaign finance document claiming NZ went into debt to pay for World War II — widely mocked as historically incorrect'],
  },

  'todd-mcclay': {
    career_before_politics: ['Farmer and business background in Rotorua', 'Previous careers in banking and business'],
    career_in_politics: ['MP since 2005', 'Minister of Trade, Agriculture, and Forestry under Key/English governments', 'Minister of Trade since November 2023'],
    key_positions: ['Free trade agreements and export access', 'Agricultural trade and market diversification', 'Economic growth through international commerce'],
    accomplishments: ['Long tenure as senior National MP across multiple parliaments', 'Instrumental in advancing NZ trade relationships globally'],
    controversies: ['Limited major controversies — focused primarily on trade and agricultural policy'],
  },

  'matt-doocey': {
    career_before_politics: ['Community mental health advocate', 'Youth development and social sector work in Canterbury'],
    career_in_politics: ['MP for Waimakariri since 2020', 'Minister for Mental Health since November 2023 — first ever dedicated role'],
    key_positions: ['Mental health system investment and reform', 'Youth mental health and suicide prevention', 'Christchurch regional recovery'],
    accomplishments: ['Appointed as NZ\'s first ever dedicated Minister for Mental Health', 'Advocacy for improved mental health services in Canterbury'],
    controversies: ['Critics argue mental health funding has not increased sufficiently under his watch'],
  },

  'penny-simmonds': {
    career_before_politics: ['CEO of the Southern Institute of Technology (SIT) in Invercargill', 'Long career in tertiary education administration'],
    career_in_politics: ['MP for Invercargill since 2020', 'Minister for Tertiary Education and Skills since November 2023'],
    key_positions: ['Tertiary education reform and funding', 'Vocational training and trades', 'Southland and provincial development'],
    accomplishments: ['Brought direct tertiary sector leadership experience to the portfolio', 'Advocate for regional tertiary institutions'],
    controversies: ['Reform of vocational education (Te Pūkenga) drew significant sector criticism', 'Tertiary funding cuts affected many institutions'],
  },

  'simon-bridges': {
    career_before_politics: ['Crown prosecutor (barrister)', 'University of Auckland law graduate'],
    career_in_politics: ['MP since 2008', 'Attorney-General and Minister of Transport, Energy 2014–2017', 'Leader of the Opposition and National Party leader 2018–2020', 'Won Tauranga at 2023 election'],
    key_positions: ['Law and order', 'Economic development for Tauranga and Bay of Plenty', 'Competitive free-market policy'],
    accomplishments: ['Held senior ministerial roles under Key government', 'Successfully reclaimed Tauranga for National in 2023 after the electorate had drifted away'],
    controversies: ['Leadership ousted by Judith Collins in 2020 after phone calls to colleagues were leaked to media', 'Multiple leadership tensions within National during his tenure as leader'],
  },

  // ── Labour ─────────────────────────────────────────────────────────────────

  'chris-hipkins': {
    career_before_politics: ['Student politics — elected VUWSA President twice (2000, 2001)', 'Policy adviser for Labour education ministers', 'Worked in office of Prime Minister Helen Clark'],
    career_in_politics: ['MP for Remutaka since 2008', 'Minister of Education and Leader of the House 2017–2023', 'Minister of Health and COVID-19 Response 2020–2022', 'Prime Minister January–November 2023', 'Leader of the Opposition since November 2023'],
    key_positions: ['Cost of living focus — workers, housing, health', 'Anti-AUKUS', 'Palestinian statehood recognition', 'NZ Future Fund sovereign wealth policy'],
    accomplishments: ["Led NZ's COVID-19 response as Health Minister — widely praised internationally", "Became PM as consensus candidate after Ardern's resignation", 'Retained leadership after heavy 2023 election defeat'],
    controversies: ['Led Labour to worst MMP-era defeat in 2023 — 65 seats to 34', 'Leadership questioned multiple times through 2024–2025 as poll numbers stayed low', 'Arrested in 1997 during student protest at Parliament — later received compensation and apology'],
  },

  'carmel-sepuloni': {
    career_before_politics: ['Social worker and community advocate', 'University of Auckland — studied social work'],
    career_in_politics: ['MP since 2008', 'Minister of Social Development and Employment 2017–2023', 'Deputy Prime Minister 2023 — first Pasifika person to hold the role', 'Deputy Leader of the Opposition since November 2023'],
    key_positions: ['Social development and poverty reduction', 'Pacific Peoples representation', 'Child poverty reduction'],
    accomplishments: ['First Pasifika Deputy Prime Minister in NZ history', 'Oversaw significant welfare reforms including benefit increases during Labour government'],
    controversies: ['Criticised for welfare system performance during her time as Social Development Minister', 'Some advocates said benefit increases were insufficient'],
  },

  'barbara-edmonds': {
    career_before_politics: ['Tax lawyer', 'Former Beehive staffer', 'Mother of eight'],
    career_in_politics: ['MP since 2020', 'Promoted to Finance spokesperson in 2024 after Grant Robertson\'s resignation', 'Ranked 4th in Labour caucus'],
    key_positions: ['NZ Future Fund — sovereign wealth fund modelled on Singapore\'s Temasek', 'Progressive taxation', 'Economic investment in New Zealand'],
    accomplishments: ['Rose rapidly through Labour ranks', 'Unveiled NZ Future Fund policy in 2024', 'Widely seen as a future Labour leader'],
    controversies: ['Still building profile as finance spokesperson — limited track record in the role'],
  },

  'megan-woods': {
    career_before_politics: ['Academic — PhD in History from University of Canterbury', 'Lecturer at University of Canterbury'],
    career_in_politics: ['MP since 2011', 'Minister of Energy and Resources, Housing, Research, Science and Innovation under Labour government', 'Energy and Resources spokesperson in opposition'],
    key_positions: ['Renewable energy transition', 'Housing supply and affordability', 'Research and science investment'],
    accomplishments: ["One of Labour's most senior and experienced MPs", 'Managed major housing and energy portfolios simultaneously'],
    controversies: ["Housing crisis worsened during Labour's tenure despite her role as Housing Minister", 'Critics questioned effectiveness of housing policies'],
  },

  'willie-jackson': {
    career_before_politics: ['Prominent broadcaster and media personality', 'Iwi radio and television — co-host of various programmes', 'Community and Māori rights advocate'],
    career_in_politics: ['MP since 2017', 'Minister of Māori Development, Broadcasting and Employment under Labour government', 'Ranked 5th in Labour caucus'],
    key_positions: ['Māori development and self-determination', 'Māori media and broadcasting', 'Employment and workplace relations'],
    accomplishments: ['Long career in Māori broadcasting before politics', 'Senior Māori voice within Labour caucus'],
    controversies: ['Made controversial comments defending a colleague accused of sexual harassment in 2018 — widely criticised', 'Has clashed publicly with Te Pāti Māori over representation of Māori interests'],
  },

  'kieran-mcanulty': {
    career_before_politics: ['Local government — Masterton District Councillor', 'Business background in the Wairarapa region'],
    career_in_politics: ['MP for Wairarapa since 2020', 'Minister for Emergency Management during Auckland floods and Cyclone Gabrielle 2023', 'Shadow Leader of the House since November 2023'],
    key_positions: ['Housing affordability and supply', 'Regional development', 'Local government'],
    accomplishments: ['Widely praised for handling of 2023 Auckland Anniversary Weekend floods and Cyclone Gabrielle response', "One of Labour's most popular and high-profile MPs", 'Seen as a future leader of the Labour Party'],
    controversies: ["One of Labour's cleanest political profiles — limited major controversies"],
  },

  'ayesha-verrall': {
    career_before_politics: ['Medical doctor — infectious disease specialist', 'Public health researcher at University of Otago Wellington'],
    career_in_politics: ['MP since 2020', 'Minister of Health and Food Safety under Labour government', 'Health spokesperson in opposition since 2023'],
    key_positions: ['Public health system investment', 'Preventive health and primary care', 'Pandemic preparedness'],
    accomplishments: ['Brought direct medical expertise to the health portfolio', 'Oversaw establishment of Te Whatu Ora (Health NZ) under Labour'],
    controversies: ['Te Whatu Ora was placed under a commissioner by the incoming National government citing financial mismanagement during its establishment'],
  },

  'ginny-andersen': {
    career_before_politics: ['Community and social sector work', 'Local government involvement'],
    career_in_politics: ['MP since 2017', 'Minister of Police under Labour government', 'Police spokesperson in opposition'],
    key_positions: ['Community policing and prevention', 'Family and sexual violence prevention', 'Treaty of Waitangi negotiations'],
    accomplishments: ['Increased police budget by 35% and police numbers by 15% during her ministerial tenure'],
    controversies: ['Faced bullying allegations from within her office in 2023', 'Lost Hutt South electorate to National\'s Chris Bishop in 2023'],
  },

  'duncan-webb': {
    career_before_politics: ['Lawyer — senior legal practitioner', 'University of Canterbury — law lecturer'],
    career_in_politics: ['MP since 2017', 'Justice spokesperson in opposition', 'Signalled retirement ahead of 2026 election'],
    key_positions: ['Justice system reform', 'Regulation and consumer protection', 'Christchurch earthquake recovery'],
    accomplishments: ["Described as 'forensic' in his scrutiny of legislation", 'Strong legal background brought to justice portfolio'],
    controversies: ['Relatively low public profile'],
  },

  'camilla-belich': {
    career_before_politics: ['Lawyer'],
    career_in_politics: ['MP since 2020', 'Senior Whip', "Passed private member's bill making wage theft a criminal offence in 2025"],
    key_positions: ["Workers' rights", 'Employment law', "Women's rights"],
    accomplishments: ['Crimes (Theft By Employer) Amendment Bill passed March 2025 — landmark workers rights legislation'],
    controversies: ['Limited controversies'],
  },

  'jan-tinetti': {
    career_before_politics: ['School principal and teacher', 'Long career in primary education'],
    career_in_politics: ['MP since 2017', 'Minister of Education and Broadcasting under Labour 2020–2023', 'Education spokesperson in opposition'],
    key_positions: ['Education investment and equity', 'Early childhood education', 'Media and broadcasting'],
    accomplishments: ['Brought direct teaching and school leadership experience to the education portfolio', 'Senior Labour voice on education policy'],
    controversies: ['Lost Tauranga electorate to Simon Bridges in 2023', 'Returned as a list MP'],
  },

  'willow-jean-prime': {
    career_before_politics: ['Community organiser and advocate in Northland', 'Ngāpuhi — involved in iwi and hapū governance'],
    career_in_politics: ['List MP since 2020', 'Advocate for Northland and Māori communities within Labour caucus'],
    key_positions: ['Northland regional development', 'Māori communities and wellbeing', 'Youth and families'],
    accomplishments: ['Consistent voice for Northland communities in Parliament', 'Brings Māori perspective to Labour caucus'],
    controversies: ['Limited major controversies'],
  },

  // ── ACT ────────────────────────────────────────────────────────────────────

  'david-seymour': {
    career_before_politics: ['Electrical engineer', 'Worked for conservative think tanks in Canada', 'Involved in legislation enabling Partnership (Charter) Schools'],
    career_in_politics: ["MP for Epsom since 2014 — entered as ACT's sole MP", 'Leader of ACT since 2014', 'Deputy Prime Minister from May 2025', 'Minister for Regulation since 2023 — first ever holder of this portfolio'],
    key_positions: ['Free market economics and reduced government', 'Treaty Principles Bill — redefine Treaty of Waitangi principles via referendum', 'Charter schools and education choice', 'Individual freedom and personal responsibility', 'Reduce Parliament from 120 to 100 MPs'],
    accomplishments: ['Passed End of Life Choice Act — landmark euthanasia legislation', 'Grew ACT from 1 seat in 2014 to 11 seats in 2023', 'Passed Regulatory Standards Act 2025', "Appeared on Dancing with the Stars", "Raised $60,000 for Prostate Cancer Foundation after sparring with Jacinda Ardern"],
    controversies: ['Treaty Principles Bill sparked nationwide protests and a parliamentary haka — voted down 11-112 in April 2025', 'Publicly contradicted PM Luxon multiple times', 'Instructed Pharmac to stop considering Treaty of Waitangi in decisions', 'Has partial Māori ancestry but opposes Māori co-governance arrangements'],
  },

  'brooke-van-velden': {
    career_before_politics: ['Policy analyst and political advisor', 'University of Auckland graduate'],
    career_in_politics: ['List MP since 2020', 'Won Tāmaki electorate in 2023', 'Deputy Leader of ACT since 2020', 'Minister for Workplace Relations and Safety and Internal Affairs since 2023'],
    key_positions: ['Workplace flexibility and reduced employment regulation', '90-day no-cause eviction trial periods', 'Individual employment contracts over collective bargaining'],
    accomplishments: ['First ACT MP to win Tāmaki electorate', 'Reinstated 90-day no-cause evictions', 'Scrapped Fair Pay Agreements introduced by Labour'],
    controversies: ['Fair Pay Agreement repeal criticised by unions as stripping worker protections', '90-day eviction policy criticised by housing advocates as harmful to renters'],
  },

  'nicole-mckee': {
    career_before_politics: ['CEO of the Council of Licensed Firearms Owners (COLFO)', 'Prominent firearms rights advocate'],
    career_in_politics: ['List MP since 2020', 'Ranked 3rd on ACT list', 'Associate Minister of Justice and Police since 2023'],
    key_positions: ['Firearms law reform — rollback of post-Christchurch attack restrictions', 'Law and order', 'Individual rights'],
    accomplishments: ["Led ACT's firearms policy work", "Strong advocate for licensed firearms owners' rights"],
    controversies: ['Push to soften firearms laws following Christchurch mosque attacks drew criticism from survivors and victim advocates', 'Background as firearms lobby CEO seen as conflict of interest by critics'],
  },

  'todd-stephenson': {
    career_before_politics: ['Health industry professional', 'Based in Southland'],
    career_in_politics: ['List MP since 2023 — new entrant ranked 4th on ACT list'],
    key_positions: ['Health system efficiency', 'Regional economic development', 'Reduced regulation'],
    accomplishments: ["Entered Parliament as one of ACT's new 2023 intake"],
    controversies: ['Limited public profile as a first-term MP'],
  },

  'andrew-hoggard': {
    career_before_politics: ['Farmer', 'President of Federated Farmers of New Zealand'],
    career_in_politics: ['List MP since 2023 — ranked 5th on ACT list', 'Associate Minister of Agriculture'],
    key_positions: ['Reducing agricultural regulation', 'Farmer rights and rural communities', 'Rollback of freshwater and emissions regulations on farming'],
    accomplishments: ['Brought significant farming sector credibility to ACT caucus', 'Former Federated Farmers president — well-known in rural NZ'],
    controversies: ['Environmental advocates criticise his push to weaken freshwater regulations protecting waterways from agricultural runoff'],
  },

  'karen-chhour': {
    career_before_politics: ['Former state care recipient — personal experience with Oranga Tamariki system', 'Community advocate'],
    career_in_politics: ['List MP since 2020', 'Ranked 6th on ACT list in 2023', 'Minister for Children since 2023'],
    key_positions: ['Oranga Tamariki reform', 'Child protection system overhaul', 'Reducing ideology-driven policy in child welfare'],
    accomplishments: ['Brought lived experience of state care to the children\'s portfolio', 'Oversaw significant reforms to Oranga Tamariki'],
    controversies: ['Proposed removing Section 7AA of the Oranga Tamariki Act — drew strong opposition from Māori groups and child advocates', 'Critics argued her reforms risk harming Māori children disproportionately in the care system'],
  },

  'mark-cameron': {
    career_before_politics: ['Farmer and rural business owner'],
    career_in_politics: ['List MP since 2020', 'Ranked 7th on ACT list in 2023'],
    key_positions: ['Rural communities', 'Farming and agricultural deregulation', 'Property rights'],
    accomplishments: ['Consistent rural voice within ACT caucus'],
    controversies: ['Limited public profile'],
  },

  'simon-court': {
    career_before_politics: ['Engineer and environmental consultant'],
    career_in_politics: ['List MP since 2020', 'Ranked 8th on ACT list in 2023'],
    key_positions: ['Resource Management Act reform', 'Reducing environmental regulatory burden', 'Infrastructure development'],
    accomplishments: ['Active in RMA reform select committee work'],
    controversies: ["Referred to Parliament's Privileges Committee in 2023 for leaking confidential select committee vote — found to have committed a clear breach and apologised"],
  },

  // ── Green ──────────────────────────────────────────────────────────────────

  'chloe-swarbrick': {
    career_before_politics: ['Digital consultancy and artist management', "Opened café and gallery 'Olly' in Mount Eden, Auckland", 'Ran for Auckland Mayor in 2016 — came third'],
    career_in_politics: ['List MP since 2017 — youngest MP at the time at age 23', 'Won Auckland Central electorate in 2020', 'Retained Auckland Central in 2023', 'Co-Leader of the Green Party since March 2024'],
    key_positions: ['Climate change and bold emissions reduction', 'Wealth tax and income inequality', 'Drug law reform', 'Mental health system investment', "Israel sanctions — member's bill submitted December 2024"],
    accomplishments: ["Famous 'OK Boomer' moment in Parliament went viral globally", 'Only second Green MP ever to win an electorate — held it for more than one term', "Named to Fortune '40 Under 40' in 2020", 'Won Jane Goodall Trailblazer Award 2019'],
    controversies: ['Removed from Parliament by Speaker Brownlee in August 2025 for criticising government MPs — refused to apologise and was suspended again', 'Apologised to Parliament in 2024 after accusing PM Luxon of lying in the debating chamber'],
  },

  'marama-davidson': {
    career_before_politics: ['Community activist and social justice advocate', 'Involved in Gaza Freedom Flotilla 2011'],
    career_in_politics: ['List MP since 2017', 'Co-Leader of the Green Party since 2018 (stepped back from co-leadership after an incident in March 2023, resumed)', 'Minister for the Prevention of Family and Sexual Violence 2020–2023'],
    key_positions: ['Family and sexual violence prevention', 'Māori and Pasifika rights', 'Social justice and poverty elimination', 'Treaty of Waitangi'],
    accomplishments: ['First Māori woman to lead a NZ political party', 'Ministerial role focused on family violence prevention'],
    controversies: ["Made controversial comments in 2023 attributing violence against women to 'white cis men' shortly after being hit by a car at a protest — widely criticised across the political spectrum"],
  },

  'julie-anne-genter': {
    career_before_politics: ['Transport planner and urban mobility consultant', 'Born in the United States — moved to New Zealand', "Master's degree in City Planning from UC Berkeley"],
    career_in_politics: ['List MP since 2011', 'Won Rongotai electorate in 2023', 'Associate Minister of Transport and Minister for Women 2017–2020'],
    key_positions: ['Public transport and active travel', 'Urban planning and housing density', "Women's rights", 'Climate policy'],
    accomplishments: ['Won Rongotai electorate in 2023 — expanded Green electorate presence', 'Leading voice on transport and urban policy in NZ', 'Gave birth in Parliament — brought global attention to parental rights in legislatures'],
    controversies: ['Cycling to hospital while in labour drew widespread media attention'],
  },

  'tamatha-paul': {
    career_before_politics: ['Wellington City Councillor', 'Community organiser and activist'],
    career_in_politics: ['Wellington City Councillor before entering Parliament', 'Won Wellington Central electorate in 2023 — third Green electorate MP'],
    key_positions: ['Housing affordability', 'Urban issues', 'Climate action', 'Social justice'],
    accomplishments: ['Won Wellington Central — significant gain for Greens', 'Brought local government experience to Parliament'],
    controversies: ['Limited controversies as a first-term MP'],
  },

  'ricardo-menendez-march': {
    career_before_politics: ['Anti-poverty campaigner', 'Born in Tijuana, Mexico — first Latin American MP in NZ history', 'Community organiser focused on migrant workers and welfare'],
    career_in_politics: ['List MP since 2020', 'Led campaigns to end benefit sanctions and lift incomes', 'Social development and employment spokesperson'],
    key_positions: ['Welfare system reform — end benefit sanctions', 'Migrant worker protections', 'Income adequacy and poverty elimination', 'Guaranteed minimum income'],
    accomplishments: ['First Latin American MP in NZ history', 'Successfully campaigned for benefit sanctions reform', "Strong advocate for migrant workers' rights"],
    controversies: ["Shane Jones made remarks about 'sending Mexicans home' targeting him — widely condemned as racist", "His tweet 'From the river to the sea, Palestine will be free' was cited by ACT to oppose a Green Palestine motion"],
  },

  'teanau-tuiono': {
    career_before_politics: ['Over 20 years as activist, advocate and organiser at local, national and international levels', 'Cook Islander — first Pasifika Green MP'],
    career_in_politics: ['List MP since 2020', 'First Pasifika Green MP', 'Pacific peoples and environment spokesperson'],
    key_positions: ['Pacific peoples and climate change', 'Indigenous rights', 'Environment and conservation'],
    accomplishments: ['First Pasifika MP for the Green Party', 'Long activist background before entering Parliament'],
    controversies: ["Winston Peters criticised him for referring to NZ as 'Aotearoa' in Parliament in February 2026"],
  },

  'lan-pham': {
    career_before_politics: ['Of Vietnamese and Pākehā heritage', 'Community and environmental work in Christchurch'],
    career_in_politics: ['List MP since 2023 — new entrant', 'First MP with Vietnamese heritage in NZ history'],
    key_positions: ['Environment and climate', 'Multicultural representation', 'Community wellbeing'],
    accomplishments: ['First MP with Vietnamese heritage in NZ history'],
    controversies: ['Limited public profile as a first-term MP'],
  },

  'steve-abel': {
    career_before_politics: ['Long-time environment and climate activist', 'Successful advocacy campaigns to end native logging and protect forests'],
    career_in_politics: ['List MP since 2023 — new entrant'],
    key_positions: ['Native forest protection', 'Climate action', 'Conservation'],
    accomplishments: ['Decades of environmental activism before entering Parliament', 'Led campaigns ending native logging'],
    controversies: ['Limited parliamentary controversies as a first-term MP'],
  },

  'lawrence-xu-nan': {
    career_before_politics: ['Academic and community advocate', 'Of Chinese heritage'],
    career_in_politics: ['Entered Parliament in 2024 replacing Efeso Collins who died in February 2024'],
    key_positions: ['Multicultural representation', 'Social justice', 'Climate policy'],
    accomplishments: ['Brought diverse ethnic representation to Green caucus'],
    controversies: ["Winston Peters accused him of seeking to impose 'foreign ideas' on New Zealanders — widely condemned as xenophobic"],
  },

  'francisco-hernandez': {
    career_before_politics: ['Community organiser'],
    career_in_politics: ['Entered Parliament in May 2024 replacing James Shaw who resigned'],
    key_positions: ['Social justice', 'Migrant communities', 'Environment'],
    accomplishments: ['Entered Parliament as part of Green caucus renewal in 2024'],
    controversies: ["Winston Peters accused him of seeking to impose 'foreign ideas' on New Zealanders — condemned as xenophobic by Labour and Greens"],
  },

  // ── NZ First ───────────────────────────────────────────────────────────────

  'winston-peters': {
    career_before_politics: ['Lawyer — University of Otago law graduate', 'National Party MP for Tauranga from 1984', "Minister of Māori Affairs under Jim Bolger's National government"],
    career_in_politics: ['MP since 1984 — one of NZ\'s longest-serving politicians', 'Founded New Zealand First in 1993 after being expelled from National', 'Deputy PM and Treasurer 1996–1998 in coalition with National', 'Deputy PM 2017–2020 in coalition with Labour', 'Deputy PM until May 2025 in coalition with National and ACT', 'Minister of Foreign Affairs since 2023'],
    key_positions: ['NZ sovereignty and anti-globalism', 'Superannuation protection', 'Controlled immigration', 'Referendum to abolish Māori electorates', 'English as an official language of New Zealand'],
    accomplishments: ['Kingmaker in multiple elections — only party to have governed with both National and Labour under MMP', 'Led NZ First back from political oblivion after 2020 wipeout', 'Secured significant regional development and infrastructure funding in coalition deals'],
    controversies: ['Made remarks targeting Green MPs from migrant backgrounds — accused of racism in 2025', "Repeatedly criticised use of te reo Māori 'Aotearoa' in Parliament", 'Publicly undercut Finance Minister Nicola Willis by claiming tax cuts created a $5.6b fiscal hole', 'Long history of political controversy spanning four decades'],
  },

  'shane-jones': {
    career_before_politics: ['Lawyer and businessman', 'Pacific Economic Ambassador — appointed 2014 after leaving Labour'],
    career_in_politics: ['Labour list MP 2005–2014', 'Contested Labour leadership in 2013 — lost to David Cunliffe', 'NZ First MP 2017–2020', 'NZ First MP for Northland since 2023', 'Deputy Leader of NZ First since September 2025', 'Minister for Regional Development, Oceans and Fisheries, Resources since 2023'],
    key_positions: ['Regional economic development', 'Fishing and ocean resource management', 'Resource extraction — mining, oil and gas', 'Anti-co-governance', 'Immigration control'],
    accomplishments: ['Provincial Growth Fund — directed billions to regional NZ during 2017–2020 Labour coalition', 'Senior voice for Northland and regional NZ', 'Elected Deputy Leader of NZ First unanimously in 2025'],
    controversies: ["Made remarks about 'sending Mexicans home' targeting Green MP Ricardo Menéndez March — widely condemned as racist", "Accused Green MPs of imposing 'foreign ideas' on NZ", 'Past allegations regarding use of parliamentary credit card while a Labour MP'],
  },

  'casey-costello': {
    career_before_politics: ['Detective Sergeant in NZ Police', 'Vice President of the Police Association — first woman elected to this role', "Founding trustee of Hobson's Pledge", 'Former chairperson of the NZ Taxpayers\' Union'],
    career_in_politics: ['List MP since 2023 — new entrant ranked 3rd on NZ First list', 'Minister for Customs and Associate Minister of Health and Immigration since 2023'],
    key_positions: ['Opposition to co-governance and Māori-specific policy', 'Law and order', 'Immigration control', 'Customs and border security'],
    accomplishments: ['Brought police and law enforcement background to Parliament', 'Senior NZ First voice on health and immigration policy'],
    controversies: ["Founding trustee of Hobson's Pledge — widely criticised for its opposition to Māori rights", 'Has Ngāpuhi/Ngāti Wai Māori ancestry but actively opposes co-governance arrangements'],
  },

  'mark-patterson': {
    career_before_politics: ['Beef and sheep farmer in Otago', 'Otago Federated Farmers chair'],
    career_in_politics: ['List MP 2017–2020', 'Returned as list MP in 2023 — ranked 4th on NZ First list', 'Associate Minister of Agriculture'],
    key_positions: ['Agricultural deregulation', 'Farmer rights and rural communities', 'Reducing environmental compliance costs for farmers'],
    accomplishments: ['Consistent voice for South Island farming communities', 'Brought practical farming knowledge to agricultural policy'],
    controversies: ['Switched from National to NZ First after Silver Fern Farms sale to Chinese buyers in 2016'],
  },

  'jenny-marcroft': {
    career_before_politics: ['30 years in radio and television broadcasting', 'Worked in health sector after first parliamentary stint', 'Worked for Auckland Mayor Wayne Brown'],
    career_in_politics: ['List MP 2017–2020 — first stint', 'Resigned from NZ First after 2020 defeat citing cultural issues', 'Returned as list MP in 2023'],
    key_positions: ['Broadcasting and media', 'Health sector', 'Regional representation'],
    accomplishments: ['Long broadcasting career including early advocacy for correct Māori language pronunciation on air', 'Ngāpuhi wahine bringing Māori perspective to NZ First'],
    controversies: ['Resigned from NZ First after 2020 defeat citing internal cultural issues — then rejoined for 2023'],
  },

  'jamie-arbuckle': {
    career_before_politics: ['Military background — army officer'],
    career_in_politics: ['List MP since 2023 — ranked 6th on NZ First list, new entrant'],
    key_positions: ['Defence and national security', 'Law and order'],
    accomplishments: ['Brought military background to NZ First caucus'],
    controversies: ['Limited public profile as a first-term MP'],
  },

  'andy-foster': {
    career_before_politics: ['Mayor of Wellington 2019–2022', 'Wellington City Councillor for many years before becoming mayor'],
    career_in_politics: ['List MP since 2023 — ranked 7th on NZ First list, new entrant'],
    key_positions: ['Local government and urban issues', 'Infrastructure', 'Wellington regional interests'],
    accomplishments: ['Former Wellington Mayor — brought significant local government experience to Parliament'],
    controversies: ['Lost Wellington mayoral race in 2022 to Tory Whanau'],
  },

  'tanya-unkovich': {
    career_before_politics: ['Anti-COVID restrictions campaigner', 'Community activist'],
    career_in_politics: ['List MP since 2023 — ranked 8th on NZ First list, new entrant'],
    key_positions: ['Individual freedoms', 'Scepticism of government mandates'],
    accomplishments: ["Entered Parliament as part of NZ First's 2023 comeback"],
    controversies: ['Background as anti-COVID restrictions campaigner drew scrutiny'],
  },

  // ── Te Pāti Māori ─────────────────────────────────────────────────────────

  'rawiri-waititi': {
    career_before_politics: ['Teacher', 'Musician and artist', 'Māori language and culture advocate', 'Community leader in Rotorua'],
    career_in_politics: ['MP for Waiariki since 2020', 'Co-Leader of Te Pāti Māori since 2021', 'Prominent voice for Treaty justice in the 54th Parliament'],
    key_positions: ['Tino rangatiratanga — Māori self-determination', 'Treaty of Waitangi justice and implementation', 'Te reo Māori language revival', 'Abolition of the Māori electorate system in favour of full Te Tiriti representation', 'Māori economic development'],
    accomplishments: ['Led powerful haka alongside Hana-Rawhiti Maipi-Clarke during Treaty Principles Bill first reading — gained global attention', 'Helped grow Te Pāti Māori to its best MMP-era result in 2023 — winning all seven Māori electorates', 'Youngest co-leader of a NZ parliamentary party at the time of his appointment'],
    controversies: ['Repeatedly suspended from Parliament for wearing traditional hei tiki instead of the required tie — challenged the Westminster dress code on principle', 'Charged with drink-driving in 2022 — stood down temporarily as co-leader, later cleared of the charge'],
  },

  'debbie-ngarewa-packer': {
    career_before_politics: ['CEO of Te Kāhui o Taranaki Trust', 'Community leader in Taranaki', 'Involved in iwi governance and Māori health and education'],
    career_in_politics: ['MP for Te Tai Hauāuru since 2020', 'Co-Leader of Te Pāti Māori since 2021'],
    key_positions: ['Māori self-determination and Treaty-based governance', 'Environmental justice — opposing seabed mining and deep-sea oil exploration', 'Taranaki iwi rights', 'Māori economic sovereignty'],
    accomplishments: ['First co-leader of Te Pāti Māori from Taranaki', "Strong advocate for Taranaki whānui ki Te Upoko o Te Ika iwi rights", "Retained Te Tai Hauāuru in the 2023 election with an increased majority"],
    controversies: ['Described the government\'s Treaty policies as "colonial" — drew strong responses from coalition parties', 'Strong stance against Fast Track Approvals Act drew debate about the balance between development and environmental protection'],
  },

  'hana-rawhiti-maipi-clarke': {
    career_before_politics: ['Student activist', 'Grew up in Kirikiriroa (Hamilton)', 'Youth and community advocate'],
    career_in_politics: ['MP for Hauraki-Waikato since 2023', 'Youngest MP in New Zealand history — entered Parliament at age 21'],
    key_positions: ['Youth representation in Parliament', 'Treaty of Waitangi and Māori rights', 'Climate action', 'Economic justice for young New Zealanders'],
    accomplishments: ['Youngest MP in NZ history', 'Led a powerful haka during the Treaty Principles Bill first reading in November 2024 — went viral globally and garnered international media coverage', 'Retained Hauraki-Waikato for Te Pāti Māori in 2023', 'Symbolises generational shift in Māori political representation'],
    controversies: ['Suspended from Parliament following her haka protest during the Treaty Principles Bill — the action drew both widespread praise from Māori communities and criticism from government MPs', 'Her tactics in Parliament have been described as disruptive by opponents and as principled resistance by supporters'],
  },

  'takuta-ferris': {
    career_before_politics: ['Lawyer specialising in Treaty of Waitangi claims and Māori rights', 'Te Tau Ihu (top of the South Island) — South Island Māori advocate'],
    career_in_politics: ['MP for Te Tai Tonga since 2023'],
    key_positions: ['Treaty of Waitangi justice', 'South Island Māori representation', 'Māori rights in law and policy'],
    accomplishments: ['Won Te Tai Tonga for Te Pāti Māori — a significant gain for the party', 'Brought legal expertise to Te Pāti Māori caucus', 'First Te Pāti Māori MP for Te Tai Tonga in many years'],
    controversies: ['Limited controversies as a first-term MP'],
  },

  'mariameno-kapa-kingi': {
    career_before_politics: ['Community leader in Northland', 'Involved in Māori health, education, and social services in Te Tai Tokerau', 'Ngāpuhi iwi connections'],
    career_in_politics: ['MP for Te Tai Tokerau since 2023'],
    key_positions: ['Northland regional development', 'Māori health and wellbeing', 'Treaty rights', 'Education equity'],
    accomplishments: ['Won Te Tai Tokerau for Te Pāti Māori from Kelvin Davis (Labour) — a significant victory', 'Strong community roots in Northland'],
    controversies: ['Limited controversies as a first-term MP'],
  },

  'hemi-walker': {
    career_before_politics: ['Community advocate in Hawke\'s Bay and East Coast region', 'Involved in Māori community organisations'],
    career_in_politics: ['MP for Ikaroa-Rāwhiti since 2023'],
    key_positions: ['East Coast and Hawke\'s Bay regional development', 'Māori communities and wellbeing', 'Treaty justice'],
    accomplishments: ['Won Ikaroa-Rāwhiti for Te Pāti Māori in 2023'],
    controversies: ['Limited public profile as a first-term MP'],
  },
};

export default MP_PROFILES;
