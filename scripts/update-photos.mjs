import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const PHOTOS = {
  'christopher-luxon':      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/LUXON%2C_Christopher_-_Botany_%28cropped%29.png/330px-LUXON%2C_Christopher_-_Botany_%28cropped%29.png',
  'nicola-willis':          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/WILLIS%2C_Nicola_-_Ohariu_%28cropped%29.png/330px-WILLIS%2C_Nicola_-_Ohariu_%28cropped%29.png',
  'chris-bishop':           'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/BISHOP%2C_Chris_-_Hutt_South_%28cropped_alt%29.png/330px-BISHOP%2C_Chris_-_Hutt_South_%28cropped_alt%29.png',
  'shane-reti':             'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/RETI%2C_Shane_-_Whangarei_%28cropped%29.png/330px-RETI%2C_Shane_-_Whangarei_%28cropped%29.png',
  'judith-collins':         'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/2025_Judith_Collins_%28cropped%29.jpg/330px-2025_Judith_Collins_%28cropped%29.jpg',
  'erica-stanford':         'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/STANFORD%2C_Erica_-_East_Coast_Bays_%28cropped_alt%29.png/330px-STANFORD%2C_Erica_-_East_Coast_Bays_%28cropped_alt%29.png',
  'simeon-brown':           'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/BROWN%2C_Simeon_-_Pakuranga_%28cropped%29.png/330px-BROWN%2C_Simeon_-_Pakuranga_%28cropped%29.png',
  'mark-mitchell':          'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/MITCHELL%2C_Mark_-_Whangaparaoa_%28cropped%29.png/330px-MITCHELL%2C_Mark_-_Whangaparaoa_%28cropped%29.png',
  'louise-upston':          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/UPSTON%2C_Louise_-_Taupo_%28cropped%29.png/330px-UPSTON%2C_Louise_-_Taupo_%28cropped%29.png',
  'paul-goldsmith':         'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/GOLDSMITH%2C_Paul_-_Epsom_%28cropped%29.png/330px-GOLDSMITH%2C_Paul_-_Epsom_%28cropped%29.png',
  'todd-mcclay':            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/2025_Todd_McClay_%28cropped%29.jpg/330px-2025_Todd_McClay_%28cropped%29.jpg',
  'matt-doocey':            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/DOOCEY%2C_Matt_-_Waimakariri_%28cropped%29.png/330px-DOOCEY%2C_Matt_-_Waimakariri_%28cropped%29.png',
  'penny-simmonds':         'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/SIMMONDS%2C_Penny_-_Invercargill_%28cropped%29.png/330px-SIMMONDS%2C_Penny_-_Invercargill_%28cropped%29.png',
  'simon-bridges':          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Simon-Bridges-Free-Crop.jpg/330px-Simon-Bridges-Free-Crop.jpg',
  'chris-hipkins':          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Chris_Hipkins_NZ_Labour_%282%29.jpg/330px-Chris_Hipkins_NZ_Labour_%282%29.jpg',
  'carmel-sepuloni':        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Profile--carmelsepuloni-390x2-UNC.jpg/330px-Profile--carmelsepuloni-390x2-UNC.jpg',
  'barbara-edmonds':        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Profile--barbaraedmonds-2-390x2-UNC.jpg/330px-Profile--barbaraedmonds-2-390x2-UNC.jpg',
  'megan-woods':            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Profile--meganwoods-390x2-UNC.jpg/330px-Profile--meganwoods-390x2-UNC.jpg',
  'willie-jackson':         'https://upload.wikimedia.org/wikipedia/commons/e/ee/Willie_Jackson.jpg',
  'kieran-mcanulty':        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Profile--kieranmcanulty-2-390x2-UNC.jpg/330px-Profile--kieranmcanulty-2-390x2-UNC.jpg',
  'ayesha-verrall':         'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Profile--ayeshaverrall-390x2-UNC.jpg/330px-Profile--ayeshaverrall-390x2-UNC.jpg',
  'ginny-andersen':         'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Profile--ginnyandersen-3-390x2-UNC.jpg/330px-Profile--ginnyandersen-3-390x2-UNC.jpg',
  'duncan-webb':            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Duncan_Webb_%28cropped%29.jpg/330px-Duncan_Webb_%28cropped%29.jpg',
  'camilla-belich':         'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Profile--camillabelich-4-390x2-UNC.jpg/330px-Profile--camillabelich-4-390x2-UNC.jpg',
  'jan-tinetti':            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Profile--jantinetti-390x2-UNC.jpg/330px-Profile--jantinetti-390x2-UNC.jpg',
  'willow-jean-prime':      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Profile--willowjean-390x2-UNC.jpg/330px-Profile--willowjean-390x2-UNC.jpg',
  'david-seymour':          'https://upload.wikimedia.org/wikipedia/commons/2/22/David_Seymour_2023_%28cropped%29_%28cropped%29.jpg',
  'brooke-van-velden':      'https://upload.wikimedia.org/wikipedia/commons/e/ed/Brooke_van_Velden_at_2024_HASANZ_Conference_%28cropped%29.jpg',
  'nicole-mckee':           'https://upload.wikimedia.org/wikipedia/commons/1/1e/Nicole_McKee_2025_%28cropped%29.jpg',
  'todd-stephenson':        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Todd_Stephenson.jpg/330px-Todd_Stephenson.jpg',
  'andrew-hoggard':         'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Andrew_Hoggard_drinking_2024_%28cropped%29.jpg/330px-Andrew_Hoggard_drinking_2024_%28cropped%29.jpg',
  'karen-chhour':           'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Karen_Chhour_2023_%28cropped%29.jpg/330px-Karen_Chhour_2023_%28cropped%29.jpg',
  'simon-court':            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Simon_Court%2C_2025.jpg/330px-Simon_Court%2C_2025.jpg',
  'chloe-swarbrick':        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Chl%C3%B6e_Swarbrick_headshot.jpg/330px-Chl%C3%B6e_Swarbrick_headshot.jpg',
  'marama-davidson':        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Marama_Davidson_2_%28cropped%29.jpg/330px-Marama_Davidson_2_%28cropped%29.jpg',
  'julie-anne-genter':      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Julie_Anne_Genter_3_%28cropped%29.jpg/330px-Julie_Anne_Genter_3_%28cropped%29.jpg',
  'tamatha-paul':           'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Tamatha_Paul_NB_4-3_ver_2_%281%29_%28cropped%29.jpg/330px-Tamatha_Paul_NB_4-3_ver_2_%281%29_%28cropped%29.jpg',
  'ricardo-menendez-march': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Ricardo_Men%C3%A9ndez_March_%28cropped%29.jpg/330px-Ricardo_Men%C3%A9ndez_March_%28cropped%29.jpg',
  'teanau-tuiono':          'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Teanau_Tuiono_2023_%28cropped%29.jpg/330px-Teanau_Tuiono_2023_%28cropped%29.jpg',
  'lan-pham':               'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Lan_Pham1_%28cropped%29.jpg/330px-Lan_Pham1_%28cropped%29.jpg',
  'steve-abel':             'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Steve_Abel_4_%28cropped%29.jpg/330px-Steve_Abel_4_%28cropped%29.jpg',
  'lawrence-xu-nan':        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Lawrence_Xu-Nan_7_%28cropped%29.jpg/330px-Lawrence_Xu-Nan_7_%28cropped%29.jpg',
  'francisco-hernandez':    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Francisco_Hernandez_2023_%28cropped%29.jpg/330px-Francisco_Hernandez_2023_%28cropped%29.jpg',
  'winston-peters':         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Winston_Peters_2024_US_Deputy_Secretary_visit_%28further_crop%29.jpg/330px-Winston_Peters_2024_US_Deputy_Secretary_visit_%28further_crop%29.jpg',
  'shane-jones':            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shane_Jones_2018_5.jpg/330px-Shane_Jones_2018_5.jpg',
  'casey-costello':         'https://upload.wikimedia.org/wikipedia/commons/1/15/Casey_Costello_November_2024.jpg',
  'mark-patterson':         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Mark_Patterson_2019.jpg/330px-Mark_Patterson_2019.jpg',
  'jenny-marcroft':         'https://upload.wikimedia.org/wikipedia/commons/7/78/Jenny_Marcroft_%28cropped%29.jpg',
  'jamie-arbuckle':         'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Jamie_Arbuckle_2024.jpg/330px-Jamie_Arbuckle_2024.jpg',
  'andy-foster':            'https://upload.wikimedia.org/wikipedia/commons/a/a8/Official_photo_of_Andy_Foster.png',
  'tanya-unkovich':         'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Tanya_Unkovich.jpg/330px-Tanya_Unkovich.jpg',
  'rawiri-waititi':         'https://upload.wikimedia.org/wikipedia/commons/6/60/Rawiri_Waititi_August_2025.jpg',
  'debbie-ngarewa-packer':  'https://upload.wikimedia.org/wikipedia/commons/3/3a/Debbie_Ngarewa-Packer_August_2025.jpg',
  'hana-rawhiti-maipi-clarke': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Hana-Rawhiti_Maipi-Clarke_%28cropped_half-shot%29.jpg/330px-Hana-Rawhiti_Maipi-Clarke_%28cropped_half-shot%29.jpg',
  'takuta-ferris':          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/T%C4%81kuta_Ferris.jpg/330px-T%C4%81kuta_Ferris.jpg',
  'mariameno-kapa-kingi':   'https://upload.wikimedia.org/wikipedia/commons/2/2c/Mariameno_Kapa-Kingi_2025.jpg',
};

let updated = 0, skipped = 0;

for (const [slug, photo_url] of Object.entries(PHOTOS)) {
  const { error } = await supabase
    .from('mps')
    .update({ photo_url })
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
