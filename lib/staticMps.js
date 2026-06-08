// Static MP data shown when the database is empty / not seeded.
// Photos sourced from Wikipedia (Wikimedia Commons, CC-licensed).

const PARTY = {
  national:  { name: 'National Party',   slug: 'national',      color: '#1a56a4' },
  labour:    { name: 'Labour Party',      slug: 'labour',        color: '#cc0000' },
  act:       { name: 'ACT Party',         slug: 'act',           color: '#d4a017' },
  green:     { name: 'Green Party',       slug: 'green',         color: '#098137' },
  nzfirst:   { name: 'NZ First',          slug: 'nzfirst',       color: '#4b5563' },
  maori:     { name: 'Te Pāti Māori',     slug: 'te-pati-maori', color: '#b5281e' },
};

function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function mp(id, full_name, role, electorate, partyKey, photo_url = null) {
  const slug = slugify(full_name);
  return { id, slug, full_name, role, electorate: electorate || 'List MP', photo_url, contact_email: null, is_active: true, party: PARTY[partyKey] };
}

const STATIC_MPS = [
  // ── National ───────────────────────────────────────────────────────────────
  mp('nat-1',  'Christopher Luxon',     'Prime Minister',                                       'Botany',               'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/LUXON%2C_Christopher_-_Botany_%28cropped%29.png/330px-LUXON%2C_Christopher_-_Botany_%28cropped%29.png'),
  mp('nat-2',  'Nicola Willis',         'Minister of Finance, Deputy Leader',                   'Ōhāriu',               'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/WILLIS%2C_Nicola_-_Ohariu_%28cropped%29.png/330px-WILLIS%2C_Nicola_-_Ohariu_%28cropped%29.png'),
  mp('nat-3',  'Chris Bishop',          'Minister of Housing, Attorney-General',                'Hutt South',           'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/BISHOP%2C_Chris_-_Hutt_South_%28cropped_alt%29.png/330px-BISHOP%2C_Chris_-_Hutt_South_%28cropped_alt%29.png'),
  mp('nat-4',  'Shane Reti',            'Minister of Health',                                   'Whangārei',            'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/RETI%2C_Shane_-_Whangarei_%28cropped%29.png/330px-RETI%2C_Shane_-_Whangarei_%28cropped%29.png'),
  mp('nat-5',  'Judith Collins',        'Minister for National Security and Intelligence',      'Papakura',             'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/2025_Judith_Collins_%28cropped%29.jpg/330px-2025_Judith_Collins_%28cropped%29.jpg'),
  mp('nat-6',  'Erica Stanford',        'Minister of Education, Minister for Immigration',      'East Coast Bays',      'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/STANFORD%2C_Erica_-_East_Coast_Bays_%28cropped_alt%29.png/330px-STANFORD%2C_Erica_-_East_Coast_Bays_%28cropped_alt%29.png'),
  mp('nat-7',  'Simeon Brown',          'Minister of Transport, Minister of Local Government',  'Pakuranga',            'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/BROWN%2C_Simeon_-_Pakuranga_%28cropped%29.png/330px-BROWN%2C_Simeon_-_Pakuranga_%28cropped%29.png'),
  mp('nat-8',  'Mark Mitchell',         'Minister of Police',                                   'Whangaparāoa',         'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/MITCHELL%2C_Mark_-_Whangaparaoa_%28cropped%29.png/330px-MITCHELL%2C_Mark_-_Whangaparaoa_%28cropped%29.png'),
  mp('nat-9',  'Louise Upston',         'Minister for Social Development and Employment',       'Taupō',                'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/UPSTON%2C_Louise_-_Taupo_%28cropped%29.png/330px-UPSTON%2C_Louise_-_Taupo_%28cropped%29.png'),
  mp('nat-10', 'Paul Goldsmith',        'Minister of Justice',                                  'Epsom',                'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/GOLDSMITH%2C_Paul_-_Epsom_%28cropped%29.png/330px-GOLDSMITH%2C_Paul_-_Epsom_%28cropped%29.png'),
  mp('nat-11', 'Todd McClay',           'Minister of Trade',                                    null,                   'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/2025_Todd_McClay_%28cropped%29.jpg/330px-2025_Todd_McClay_%28cropped%29.jpg'),
  mp('nat-12', 'Matt Doocey',           'Minister for Mental Health',                           null,                   'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/DOOCEY%2C_Matt_-_Waimakariri_%28cropped%29.png/330px-DOOCEY%2C_Matt_-_Waimakariri_%28cropped%29.png'),
  mp('nat-13', 'Penny Simmonds',        'Minister for Tertiary Education',                      'Invercargill',         'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/SIMMONDS%2C_Penny_-_Invercargill_%28cropped%29.png/330px-SIMMONDS%2C_Penny_-_Invercargill_%28cropped%29.png'),
  mp('nat-14', 'Simon Bridges',         'MP',                                                   'Tauranga',             'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Simon-Bridges-Free-Crop.jpg/330px-Simon-Bridges-Free-Crop.jpg'),

  // ── Labour ─────────────────────────────────────────────────────────────────
  mp('lab-1',  'Chris Hipkins',         'Leader of the Opposition',                             'Remutaka',             'labour',   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Chris_Hipkins_NZ_Labour_%282%29.jpg/330px-Chris_Hipkins_NZ_Labour_%282%29.jpg'),
  mp('lab-2',  'Carmel Sepuloni',       'Deputy Leader of the Opposition',                      'Kelston',              'labour',   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Profile--carmelsepuloni-390x2-UNC.jpg/330px-Profile--carmelsepuloni-390x2-UNC.jpg'),
  mp('lab-3',  'Barbara Edmonds',       'Finance Spokesperson',                                 'Mana',                 'labour',   'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Profile--barbaraedmonds-2-390x2-UNC.jpg/330px-Profile--barbaraedmonds-2-390x2-UNC.jpg'),
  mp('lab-4',  'Megan Woods',           'Energy and Resources Spokesperson',                    'Wigram',               'labour',   'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Profile--meganwoods-390x2-UNC.jpg/330px-Profile--meganwoods-390x2-UNC.jpg'),
  mp('lab-5',  'Willie Jackson',        'Māori Development Spokesperson',                       null,                   'labour',   'https://upload.wikimedia.org/wikipedia/commons/e/ee/Willie_Jackson.jpg'),
  mp('lab-6',  'Kieran McAnulty',       'Housing Spokesperson, Shadow Leader of the House',     'Wairarapa',            'labour',   'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Profile--kieranmcanulty-2-390x2-UNC.jpg/330px-Profile--kieranmcanulty-2-390x2-UNC.jpg'),
  mp('lab-7',  'Ayesha Verrall',        'Health Spokesperson',                                  null,                   'labour',   'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Profile--ayeshaverrall-390x2-UNC.jpg/330px-Profile--ayeshaverrall-390x2-UNC.jpg'),
  mp('lab-8',  'Ginny Andersen',        'Police Spokesperson',                                  null,                   'labour',   'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Profile--ginnyandersen-3-390x2-UNC.jpg/330px-Profile--ginnyandersen-3-390x2-UNC.jpg'),
  mp('lab-9',  'Duncan Webb',           'Justice Spokesperson',                                 'Christchurch Central', 'labour',   'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Duncan_Webb_%28cropped%29.jpg/330px-Duncan_Webb_%28cropped%29.jpg'),
  mp('lab-10', 'Camilla Belich',        'Senior Whip',                                          null,                   'labour',   'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Profile--camillabelich-4-390x2-UNC.jpg/330px-Profile--camillabelich-4-390x2-UNC.jpg'),
  mp('lab-11', 'Jan Tinetti',           'Education Spokesperson',                               'Tauranga',             'labour',   'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Profile--jantinetti-390x2-UNC.jpg/330px-Profile--jantinetti-390x2-UNC.jpg'),
  mp('lab-12', 'Willow-Jean Prime',     'MP',                                                   null,                   'labour',   'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Profile--willowjean-390x2-UNC.jpg/330px-Profile--willowjean-390x2-UNC.jpg'),

  // ── ACT ────────────────────────────────────────────────────────────────────
  mp('act-1',  'David Seymour',         'Deputy Prime Minister, Minister for Regulation',       'Epsom',                'act',      'https://upload.wikimedia.org/wikipedia/commons/2/22/David_Seymour_2023_%28cropped%29_%28cropped%29.jpg'),
  mp('act-2',  'Brooke van Velden',     'Deputy Leader, Minister for Workplace Relations',      'Tāmaki',               'act',      'https://upload.wikimedia.org/wikipedia/commons/e/ed/Brooke_van_Velden_at_2024_HASANZ_Conference_%28cropped%29.jpg'),
  mp('act-3',  'Nicole McKee',          'Associate Minister of Justice',                        null,                   'act',      'https://upload.wikimedia.org/wikipedia/commons/1/1e/Nicole_McKee_2025_%28cropped%29.jpg'),
  mp('act-4',  'Todd Stephenson',       'MP',                                                   null,                   'act',      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Todd_Stephenson.jpg/330px-Todd_Stephenson.jpg'),
  mp('act-5',  'Andrew Hoggard',        'Associate Minister of Agriculture',                    null,                   'act',      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Andrew_Hoggard_drinking_2024_%28cropped%29.jpg/330px-Andrew_Hoggard_drinking_2024_%28cropped%29.jpg'),
  mp('act-6',  'Karen Chhour',          'Minister for Children',                                null,                   'act',      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Karen_Chhour_2023_%28cropped%29.jpg/330px-Karen_Chhour_2023_%28cropped%29.jpg'),
  mp('act-7',  'Mark Cameron',          'MP',                                                   null,                   'act',      null),
  mp('act-8',  'Simon Court',           'MP',                                                   null,                   'act',      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Simon_Court%2C_2025.jpg/330px-Simon_Court%2C_2025.jpg'),

  // ── Green ──────────────────────────────────────────────────────────────────
  mp('grn-1',  'Chlöe Swarbrick',       'Co-Leader',                                            'Auckland Central',     'green',    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Chl%C3%B6e_Swarbrick_headshot.jpg/330px-Chl%C3%B6e_Swarbrick_headshot.jpg'),
  mp('grn-2',  'Marama Davidson',       'Co-Leader',                                            null,                   'green',    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Marama_Davidson_2_%28cropped%29.jpg/330px-Marama_Davidson_2_%28cropped%29.jpg'),
  mp('grn-3',  'Julie Anne Genter',     'MP',                                                   'Rongotai',             'green',    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Julie_Anne_Genter_3_%28cropped%29.jpg/330px-Julie_Anne_Genter_3_%28cropped%29.jpg'),
  mp('grn-4',  'Tamatha Paul',          'MP',                                                   'Wellington Central',   'green',    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Tamatha_Paul_NB_4-3_ver_2_%281%29_%28cropped%29.jpg/330px-Tamatha_Paul_NB_4-3_ver_2_%281%29_%28cropped%29.jpg'),
  mp('grn-5',  'Ricardo Menéndez March','Social Development Spokesperson',                      null,                   'green',    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Ricardo_Men%C3%A9ndez_March_%28cropped%29.jpg/330px-Ricardo_Men%C3%A9ndez_March_%28cropped%29.jpg'),
  mp('grn-6',  'Teanau Tuiono',         'Pacific Spokesperson',                                 null,                   'green',    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Teanau_Tuiono_2023_%28cropped%29.jpg/330px-Teanau_Tuiono_2023_%28cropped%29.jpg'),
  mp('grn-7',  'Lan Pham',              'MP',                                                   null,                   'green',    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Lan_Pham1_%28cropped%29.jpg/330px-Lan_Pham1_%28cropped%29.jpg'),
  mp('grn-8',  'Steve Abel',            'MP',                                                   null,                   'green',    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Steve_Abel_4_%28cropped%29.jpg/330px-Steve_Abel_4_%28cropped%29.jpg'),
  mp('grn-9',  'Lawrence Xu-Nan',       'MP',                                                   null,                   'green',    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Lawrence_Xu-Nan_7_%28cropped%29.jpg/330px-Lawrence_Xu-Nan_7_%28cropped%29.jpg'),
  mp('grn-10', 'Francisco Hernandez',   'MP',                                                   null,                   'green',    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Francisco_Hernandez_2023_%28cropped%29.jpg/330px-Francisco_Hernandez_2023_%28cropped%29.jpg'),

  // ── NZ First ───────────────────────────────────────────────────────────────
  mp('nzf-1',  'Winston Peters',        'Leader, Minister of Foreign Affairs',                  null,                   'nzfirst',  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Winston_Peters_2024_US_Deputy_Secretary_visit_%28further_crop%29.jpg/330px-Winston_Peters_2024_US_Deputy_Secretary_visit_%28further_crop%29.jpg'),
  mp('nzf-2',  'Shane Jones',           'Deputy Leader, Minister for Regional Development',     'Northland',            'nzfirst',  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shane_Jones_2018_5.jpg/330px-Shane_Jones_2018_5.jpg'),
  mp('nzf-3',  'Casey Costello',        'Minister for Customs, Associate Minister of Health',   null,                   'nzfirst',  'https://upload.wikimedia.org/wikipedia/commons/1/15/Casey_Costello_November_2024.jpg'),
  mp('nzf-4',  'Mark Patterson',        'Associate Minister of Agriculture',                    null,                   'nzfirst',  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Mark_Patterson_2019.jpg/330px-Mark_Patterson_2019.jpg'),
  mp('nzf-5',  'Jenny Marcroft',        'MP',                                                   null,                   'nzfirst',  'https://upload.wikimedia.org/wikipedia/commons/7/78/Jenny_Marcroft_%28cropped%29.jpg'),
  mp('nzf-6',  'Jamie Arbuckle',        'MP',                                                   null,                   'nzfirst',  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Jamie_Arbuckle_2024.jpg/330px-Jamie_Arbuckle_2024.jpg'),
  mp('nzf-7',  'Andy Foster',           'MP',                                                   null,                   'nzfirst',  'https://upload.wikimedia.org/wikipedia/commons/a/a8/Official_photo_of_Andy_Foster.png'),
  mp('nzf-8',  'Tanya Unkovich',        'MP',                                                   null,                   'nzfirst',  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Tanya_Unkovich.jpg/330px-Tanya_Unkovich.jpg'),

  // ── Te Pāti Māori ─────────────────────────────────────────────────────────
  mp('tpm-1',  'Rawiri Waititi',            'Co-Leader',                                        'Waiariki',             'maori',    'https://upload.wikimedia.org/wikipedia/commons/6/60/Rawiri_Waititi_August_2025.jpg'),
  mp('tpm-2',  'Debbie Ngarewa-Packer',     'Co-Leader',                                        'Te Tai Hauāuru',       'maori',    'https://upload.wikimedia.org/wikipedia/commons/3/3a/Debbie_Ngarewa-Packer_August_2025.jpg'),
  mp('tpm-3',  'Hana-Rawhiti Maipi-Clarke', 'MP',                                               'Hauraki-Waikato',      'maori',    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Hana-Rawhiti_Maipi-Clarke_%28cropped_half-shot%29.jpg/330px-Hana-Rawhiti_Maipi-Clarke_%28cropped_half-shot%29.jpg'),
  mp('tpm-4',  'Tākuta Ferris',             'MP',                                               'Te Tai Tonga',         'maori',    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/T%C4%81kuta_Ferris.jpg/330px-T%C4%81kuta_Ferris.jpg'),
  mp('tpm-5',  'Mariameno Kapa-Kingi',      'MP',                                               'Te Tai Tokerau',       'maori',    'https://upload.wikimedia.org/wikipedia/commons/2/2c/Mariameno_Kapa-Kingi_2025.jpg'),
  mp('tpm-6',  'Hemi Walker',              'MP',                                                'Ikaroa-Rāwhiti',       'maori',    null),
];

const STATIC_BIOS = {
  'christopher-luxon':         'Former Air New Zealand CEO turned Prime Minister, leading NZ\'s first formal three-party coalition government since 2023.',
  'nicola-willis':             'Finance Minister steering NZ\'s post-COVID fiscal consolidation; former communications professional and National\'s deputy leader.',
  'chris-bishop':              'Housing and Attorney-General focused on liberalising planning laws to address NZ\'s chronic housing shortage.',
  'shane-reti':                'Health Minister and practising GP overhauling Health New Zealand and working to cut hospital waiting lists.',
  'judith-collins':            'Veteran MP and former PM (2020) heading national security; known for her tough-on-crime record spanning three decades.',
  'erica-stanford':            'Education and Immigration Minister; former teacher championing literacy reform and streamlining post-COVID immigration settings.',
  'simeon-brown':              'Transport and Local Government Minister; young conservative focused on road infrastructure and reducing council red tape.',
  'mark-mitchell':             'Police Minister and former private security contractor pushing for tougher sentencing and better-resourced frontline policing.',
  'louise-upston':             'Social Development Minister overseeing welfare reform and reinstating work obligations for beneficiaries.',
  'paul-goldsmith':            'Justice Minister and fiscal conservative; previously held Trade and Defence portfolios under National.',
  'todd-mcclay':               'Trade Minister leading NZ\'s free trade agenda; former MP for Rotorua with a business and law background.',
  'matt-doocey':               'Mental Health Minister and former social worker championing expanded community mental health services.',
  'penny-simmonds':            'Tertiary Education Minister and former polytechnic CEO overseeing vocational education reform.',
  'simon-bridges':             'Returned Tauranga MP and former National leader (2018–2020); commercial lawyer and experienced debater.',
  'chris-hipkins':             'Leader of the Opposition; became PM in 2023 replacing Jacinda Ardern, then led Labour through its election defeat.',
  'carmel-sepuloni':           'Deputy Opposition Leader; former Social Development Minister and the first Pacific Islander to serve as NZ Deputy Prime Minister.',
  'barbara-edmonds':           'Finance spokesperson and former tax lawyer focused on economic inequality and progressive fiscal policy.',
  'megan-woods':               'Energy and Resources spokesperson; former academic who oversaw major infrastructure projects as a senior Cabinet minister.',
  'willie-jackson':            'Māori Development spokesperson; broadcaster and longtime activist with decades of advocacy for Māori communities.',
  'kieran-mcanulty':           'Housing spokesperson; straight-talking former local politician known for his strong regional ties and Wairarapa roots.',
  'ayesha-verrall':            'Health spokesperson and infectious disease specialist who led NZ\'s COVID-19 response as Associate Health Minister.',
  'ginny-andersen':            'Police spokesperson; former community advocate focusing on prevention, youth justice, and family harm.',
  'duncan-webb':               'Justice spokesperson and former commercial lawyer focused on consumer protection and regulatory reform.',
  'camilla-belich':            'Senior Whip and public law specialist; previously at the Crown Law Office before entering Parliament.',
  'jan-tinetti':               'Education spokesperson and former primary school principal with a focus on early childhood and literacy.',
  'willow-jean-prime':         'Northland community leader focused on regional development, Māori housing, and underserved rural communities.',
  'david-seymour':             'Deputy PM and Minister for Regulation; architect of ACT\'s libertarian platform and author of the controversial Treaty Principles Bill.',
  'brooke-van-velden':         'ACT deputy leader and Workplace Relations Minister; focused on employment law liberalisation and reducing business regulation.',
  'nicole-mckee':              'Associate Justice Minister and former firearms lobby spokesperson championing individual rights and personal freedom.',
  'todd-stephenson':           'Young libertarian economist focused on reducing the size of government and freeing up markets.',
  'andrew-hoggard':            'Associate Agriculture Minister and former Federated Farmers president; strong advocate for farmer interests and deregulation.',
  'karen-chhour':              'Minister for Children and foster care survivor; focused on fundamentally reforming Oranga Tamariki child protection.',
  'mark-cameron':              'Farming MP focused on agricultural policy, rural communities, and reducing regulatory burden on primary producers.',
  'simon-court':               'Engineer and former local body politician focused on infrastructure delivery and resource management law reform.',
  'chloe-swarbrick':           'Green co-leader and Auckland Central MP; prominent voice on housing affordability, drug law reform, and climate action.',
  'marama-davidson':           'Green co-leader; longtime activist focused on poverty, family violence, and the wellbeing of Māori and Pacific communities.',
  'julie-anne-genter':         'Rongotai MP and transport planner advocating for cycling infrastructure, public transit, and car-free urban design.',
  'tamatha-paul':              'Wellington Central MP and community organiser focused on renters\' rights, poverty reduction, and affordable urban housing.',
  'ricardo-menendez-march':    'Social Development spokesperson; migrant rights advocate and anti-poverty campaigner originally from Mexico.',
  'teanau-tuiono':             'Pacific spokesperson focused on climate justice and NZ\'s responsibilities to low-lying Pacific Island nations.',
  'lan-pham':                  'Environmental scientist and former journalist focused on climate change policy, freshwater quality, and green economics.',
  'steve-abel':                'Longtime Green activist with deep roots in climate, anti-nuclear, and environmental justice campaigns.',
  'lawrence-xu-nan':           'Community organiser focused on LGBTQ+ rights, multiculturalism, and building bridges across diverse communities.',
  'francisco-hernandez':       'Youth activist focused on climate action, student welfare, and making politics accessible to younger New Zealanders.',
  'winston-peters':            'NZ First leader and Foreign Affairs Minister; NZ\'s longest-serving parliamentarian and perennial coalition kingmaker since 1993.',
  'shane-jones':               'Deputy leader and Regional Development Minister; outspoken champion of provincial NZ and large-scale infrastructure spending.',
  'casey-costello':            'Customs and Associate Health Minister; former police officer known for pragmatic positions on drug harm reduction.',
  'mark-patterson':            'Associate Agriculture Minister and farmer advocate focused on rural communities and the primary industries sector.',
  'jenny-marcroft':            'Former journalist turned MP focused on media freedom, regional issues, and NZ\'s economic sovereignty.',
  'jamie-arbuckle':            'Retired military officer turned MP focused on defence, veterans\' affairs, and community law and order.',
  'andy-foster':               'Former Wellington mayor focused on urban infrastructure, housing delivery, and local government accountability.',
  'tanya-unkovich':            'Businesswoman and community leader focused on small business conditions and practical economic development.',
  'rawiri-waititi':            'Co-leader and cultural powerhouse known for passionate oratory and tireless advocacy for tino rangatiratanga.',
  'debbie-ngarewa-packer':     'Co-leader and iwi leader fighting for Māori land rights, Treaty justice, and the survival of te reo Māori.',
  'hana-rawhiti-maipi-clarke': 'Youngest MP in NZ history; made global headlines performing a haka in Parliament opposing the Treaty Principles Bill.',
  'takuta-ferris':             'Te Tai Tonga MP and lawyer advocating for southern Māori communities and Treaty-based constitutional change.',
  'mariameno-kapa-kingi':      'Te Tai Tokerau MP and community health worker focused on Māori health equity and whānau ora in Northland.',
  'hemi-walker':               'Ikaroa-Rāwhiti MP and community leader focused on economic development and rangatiratanga in the eastern North Island.',
};

STATIC_MPS.forEach((m) => { m.bio_summary = STATIC_BIOS[m.slug] || null; });

export default STATIC_MPS;
