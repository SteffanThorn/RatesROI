import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const BIOS = {
  // National
  'christopher-luxon':      'Former Air New Zealand CEO turned Prime Minister, leading NZ\'s first formal three-party coalition government since 2023.',
  'nicola-willis':          'Finance Minister steering NZ\'s post-COVID fiscal consolidation; former communications professional and National\'s deputy leader.',
  'chris-bishop':           'Housing and Attorney-General focused on liberalising planning laws to address NZ\'s chronic housing shortage.',
  'shane-reti':             'Health Minister and practising GP overhauling Health New Zealand and working to cut hospital waiting lists.',
  'judith-collins':         'Veteran MP and former PM (2020) heading national security; known for her tough-on-crime record spanning three decades.',
  'erica-stanford':         'Education and Immigration Minister; former teacher championing literacy reform and streamlining post-COVID immigration settings.',
  'simeon-brown':           'Transport and Local Government Minister; young conservative focused on road infrastructure and reducing council red tape.',
  'mark-mitchell':          'Police Minister and former private security contractor pushing for tougher sentencing and better-resourced frontline policing.',
  'louise-upston':          'Social Development Minister overseeing welfare reform and reinstating work obligations for beneficiaries.',
  'paul-goldsmith':         'Justice Minister and fiscal conservative; previously held Trade and Defence portfolios under National.',

  // Labour
  'chris-hipkins':          'Leader of the Opposition; became PM in 2023 replacing Jacinda Ardern, then led Labour through its election defeat.',
  'carmel-sepuloni':        'Deputy Opposition Leader; former Social Development Minister and the first Pacific Islander to serve as NZ Deputy Prime Minister.',
  'barbara-edmonds':        'Finance spokesperson and former tax lawyer focused on economic inequality and progressive fiscal policy.',
  'megan-woods':            'Energy and Resources spokesperson; former academic who oversaw major infrastructure projects as a senior Cabinet minister.',
  'willie-jackson':         'Māori Development spokesperson; broadcaster and longtime activist with decades of advocacy for Māori communities.',
  'kieran-mcanulty':        'Housing spokesperson; straight-talking former local politician known for his strong regional ties and Wairarapa roots.',
  'ayesha-verrall':         'Health spokesperson and infectious disease specialist who led NZ\'s COVID-19 response as Associate Health Minister.',
  'ginny-andersen':         'Police spokesperson; former community advocate focusing on prevention, youth justice, and family harm.',
  'duncan-webb':            'Justice spokesperson and former commercial lawyer focused on consumer protection and regulatory reform.',
  'camilla-belich':         'Senior Whip and public law specialist; previously at the Crown Law Office before entering Parliament.',
  'jan-tinetti':            'Education spokesperson and former primary school principal with a focus on early childhood and literacy.',
  'willow-jean-prime':      'Northland community leader focused on regional development, Māori housing, and underserved rural communities.',

  // ACT
  'david-seymour':          'Deputy PM and Minister for Regulation; architect of ACT\'s libertarian platform and author of the controversial Treaty Principles Bill.',
  'brooke-van-velden':      'ACT deputy leader and Workplace Relations Minister; focused on employment law liberalisation and reducing business regulation.',
  'nicole-mckee':           'Associate Justice Minister and former firearms lobby spokesperson championing individual rights and personal freedom.',
  'todd-stephenson':        'Young libertarian economist focused on reducing the size of government and freeing up markets.',
  'andrew-hoggard':         'Associate Agriculture Minister and former Federated Farmers president; strong advocate for farmer interests and deregulation.',
  'karen-chhour':           'Minister for Children and foster care survivor; focused on fundamentally reforming Oranga Tamariki child protection.',
  'mark-cameron':           'Farming MP focused on agricultural policy, rural communities, and reducing regulatory burden on primary producers.',
  'simon-court':            'Engineer and former local body politician focused on infrastructure delivery and resource management law reform.',

  // Green
  'chloe-swarbrick':        'Green co-leader and Auckland Central MP; prominent voice on housing affordability, drug law reform, and climate action.',
  'marama-davidson':        'Green co-leader; longtime activist focused on poverty, family violence, and the wellbeing of Māori and Pacific communities.',
  'julie-anne-genter':      'Rongotai MP and transport planner advocating for cycling infrastructure, public transit, and car-free urban design.',
  'tamatha-paul':           'Wellington Central MP and community organiser focused on renters\' rights, poverty reduction, and affordable urban housing.',
  'ricardo-menendez-march': 'Social Development spokesperson; migrant rights advocate and anti-poverty campaigner originally from Mexico.',
  'teanau-tuiono':          'Pacific spokesperson focused on climate justice and NZ\'s responsibilities to low-lying Pacific Island nations.',
  'lan-pham':               'Environmental scientist and former journalist focused on climate change policy, freshwater quality, and green economics.',
  'steve-abel':             'Longtime Green activist with deep roots in climate, anti-nuclear, and environmental justice campaigns.',
  'lawrence-xu-nan':        'Community organiser focused on LGBTQ+ rights, multiculturalism, and building bridges across diverse communities.',
  'francisco-hernandez':    'Youth activist focused on climate action, student welfare, and making politics accessible to younger New Zealanders.',

  // NZ First
  'winston-peters':         'NZ First leader and Foreign Affairs Minister; NZ\'s longest-serving parliamentarian and perennial coalition kingmaker since 1993.',
  'shane-jones':            'Deputy leader and Regional Development Minister; outspoken champion of provincial NZ and large-scale infrastructure spending.',
  'casey-costello':         'Customs and Associate Health Minister; former police officer known for pragmatic positions on drug harm reduction.',
  'mark-patterson':         'Associate Agriculture Minister and farmer advocate focused on rural communities and the primary industries sector.',
  'jenny-marcroft':         'Former journalist turned MP focused on media freedom, regional issues, and NZ\'s economic sovereignty.',
  'jamie-arbuckle':         'Retired military officer turned MP focused on defence, veterans\' affairs, and community law and order.',
  'andy-foster':            'Former Wellington mayor focused on urban infrastructure, housing delivery, and local government accountability.',
  'tanya-unkovich':         'Businesswoman and community leader focused on small business conditions and practical economic development.',

  // Te Pāti Māori
  'rawiri-waititi':         'Co-leader and cultural powerhouse known for passionate oratory and tireless advocacy for tino rangatiratanga.',
  'debbie-ngarewa-packer':  'Co-leader and iwi leader fighting for Māori land rights, Treaty justice, and the survival of te reo Māori.',
  'hana-rawhiti-maipi-clarke': 'Youngest MP in NZ history; made global headlines performing a haka in Parliament opposing the Treaty Principles Bill.',
  'takuta-ferris':          'Te Tai Tonga MP and lawyer advocating for southern Māori communities and Treaty-based constitutional change.',
  'mariameno-kapa-kingi':   'Te Tai Tokerau MP and community health worker focused on Māori health equity and whānau ora in Northland.',
  'hemi-walker':            'Ikaroa-Rāwhiti MP and community leader focused on economic development and rangatiratanga in the eastern North Island.',
};

let updated = 0, skipped = 0;

for (const [slug, bio_summary] of Object.entries(BIOS)) {
  const { error } = await supabase
    .from('mps')
    .update({ bio_summary })
    .eq('slug', slug);
  if (error) {
    console.log(`  ✗ ${slug}: ${error.message}`);
    skipped++;
  } else {
    console.log(`  ✓ ${slug}`);
    updated++;
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped.`);
