#!/usr/bin/env node
/**
 * scripts/update-images.js
 *
 * Adds Wikipedia-sourced photos to MPs and logos to parties.
 * All images are CC-licensed from Wikimedia Commons / Wikipedia.
 * Attribution: Wikimedia Commons contributors, CC BY-SA / CC BY
 *
 * Usage:
 *   npx tsx scripts/update-images.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not set');
  process.exit(1);
}

const partySchema = new mongoose.Schema({ name: String, slug: String, logoUrl: String }, { timestamps: true });
const mpSchema = new mongoose.Schema({ fullName: String, slug: String, photoUrl: String }, { timestamps: true });

const Party = mongoose.models.Party || mongoose.model('Party', partySchema);
const MP = mongoose.models.MP || mongoose.model('MP', mpSchema);

const PARTY_LOGOS = [
  { slug: 'national', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/New_Zealand_National_Party_logo.png/250px-New_Zealand_National_Party_logo.png' },
  { slug: 'act',      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Logo_of_the_ACT_New_Zealand.svg/250px-Logo_of_the_ACT_New_Zealand.svg.png' },
  { slug: 'labour',   logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/New_Zealand_Labour_Party_logo.svg/250px-New_Zealand_Labour_Party_logo.svg.png' },
  { slug: 'greens',   logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Green_Party_of_Aotearoa_New_Zealand_logo.svg/250px-Green_Party_of_Aotearoa_New_Zealand_logo.svg.png' },
  { slug: 'nzfirst',  logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/NZ_First_logo_2017.png/250px-NZ_First_logo_2017.png' },
  { slug: 'maori',    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Te_P%C4%81ti_M%C4%81ori_logo.svg/250px-Te_P%C4%81ti_M%C4%81ori_logo.svg.png' },
];

const MP_PHOTOS = [
  // National
  { fullName: 'Christopher Luxon', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/LUXON%2C_Christopher_-_Botany_%28cropped%29.png/250px-LUXON%2C_Christopher_-_Botany_%28cropped%29.png' },
  { fullName: 'Nicola Willis',     photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/WILLIS%2C_Nicola_-_Ohariu_%28cropped%29.png/250px-WILLIS%2C_Nicola_-_Ohariu_%28cropped%29.png' },
  { fullName: 'Chris Bishop',      photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/BISHOP%2C_Chris_-_Hutt_South_%28cropped_alt%29.png/250px-BISHOP%2C_Chris_-_Hutt_South_%28cropped_alt%29.png' },
  { fullName: 'Shane Reti',        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/RETI%2C_Shane_-_Whangarei_%28cropped%29.png/250px-RETI%2C_Shane_-_Whangarei_%28cropped%29.png' },
  { fullName: 'Judith Collins',    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/2025_Judith_Collins_%28cropped%29.jpg/250px-2025_Judith_Collins_%28cropped%29.jpg' },
  { fullName: 'Erica Stanford',    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/STANFORD%2C_Erica_-_East_Coast_Bays_%28cropped_alt%29.png/250px-STANFORD%2C_Erica_-_East_Coast_Bays_%28cropped_alt%29.png' },
  { fullName: 'Simeon Brown',      photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/BROWN%2C_Simeon_-_Pakuranga_%28cropped%29.png/250px-BROWN%2C_Simeon_-_Pakuranga_%28cropped%29.png' },
  { fullName: 'Mark Mitchell',     photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/MITCHELL%2C_Mark_-_Whangaparaoa_%28cropped%29.png/250px-MITCHELL%2C_Mark_-_Whangaparaoa_%28cropped%29.png' },
  { fullName: 'Louise Upston',     photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/UPSTON%2C_Louise_-_Taupo_%28cropped%29.png/250px-UPSTON%2C_Louise_-_Taupo_%28cropped%29.png' },
  { fullName: 'Paul Goldsmith',    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/GOLDSMITH%2C_Paul_-_Epsom_%28cropped%29.png/250px-GOLDSMITH%2C_Paul_-_Epsom_%28cropped%29.png' },
  // Labour
  { fullName: 'Chris Hipkins',     photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Chris_Hipkins_NZ_Labour_%282%29.jpg/250px-Chris_Hipkins_NZ_Labour_%282%29.jpg' },
  { fullName: 'Carmel Sepuloni',   photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Profile--carmelsepuloni-390x2-UNC.jpg/250px-Profile--carmelsepuloni-390x2-UNC.jpg' },
  { fullName: 'Barbara Edmonds',   photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Profile--barbaraedmonds-2-390x2-UNC.jpg/250px-Profile--barbaraedmonds-2-390x2-UNC.jpg' },
  { fullName: 'Megan Woods',       photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Profile--meganwoods-390x2-UNC.jpg/250px-Profile--meganwoods-390x2-UNC.jpg' },
  { fullName: 'Willie Jackson',    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Willie_Jackson.jpg/250px-Willie_Jackson.jpg' },
  { fullName: 'Kieran McAnulty',   photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Profile--kieranmcanulty-2-390x2-UNC.jpg/250px-Profile--kieranmcanulty-2-390x2-UNC.jpg' },
  { fullName: 'Ayesha Verrall',    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Profile--ayeshaverrall-390x2-UNC.jpg/250px-Profile--ayeshaverrall-390x2-UNC.jpg' },
  { fullName: 'Ginny Andersen',    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Profile--ginnyandersen-3-390x2-UNC.jpg/250px-Profile--ginnyandersen-3-390x2-UNC.jpg' },
  { fullName: 'Duncan Webb',       photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Duncan_Webb_%28cropped%29.jpg/250px-Duncan_Webb_%28cropped%29.jpg' },
  { fullName: 'Camilla Belich',    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Profile--camillabelich-4-390x2-UNC.jpg/250px-Profile--camillabelich-4-390x2-UNC.jpg' },
  // Greens
  { fullName: 'Chlöe Swarbrick',       photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Chl%C3%B6e_Swarbrick_headshot.jpg/250px-Chl%C3%B6e_Swarbrick_headshot.jpg' },
  { fullName: 'Marama Davidson',        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Marama_Davidson_2_%28cropped%29.jpg/250px-Marama_Davidson_2_%28cropped%29.jpg' },
  { fullName: 'Julie Anne Genter',      photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Julie_Anne_Genter_3_%28cropped%29.jpg/250px-Julie_Anne_Genter_3_%28cropped%29.jpg' },
  { fullName: 'Tamatha Paul',           photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Tamatha_Paul_NB_4-3_ver_2_%281%29_%28cropped%29.jpg/250px-Tamatha_Paul_NB_4-3_ver_2_%281%29_%28cropped%29.jpg' },
  { fullName: 'Ricardo Menéndez March', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Ricardo_Men%C3%A9ndez_March_%28cropped%29.jpg/250px-Ricardo_Men%C3%A9ndez_March_%28cropped%29.jpg' },
  { fullName: 'Teanau Tuiono',          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Teanau_Tuiono_2023_%28cropped%29.jpg/250px-Teanau_Tuiono_2023_%28cropped%29.jpg' },
  { fullName: 'Lan Pham',               photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Lan_Pham1_%28cropped%29.jpg/250px-Lan_Pham1_%28cropped%29.jpg' },
  { fullName: 'Lawrence Xu-Nan',        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Lawrence_Xu-Nan_7_%28cropped%29.jpg/250px-Lawrence_Xu-Nan_7_%28cropped%29.jpg' },
  { fullName: 'Francisco Hernandez',    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Francisco_Hernandez_2023_%28cropped%29.jpg/250px-Francisco_Hernandez_2023_%28cropped%29.jpg' },
  // ACT
  { fullName: 'David Seymour',   photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/David_Seymour_2023_%28cropped%29_%28cropped%29.jpg/250px-David_Seymour_2023_%28cropped%29_%28cropped%29.jpg' },
  { fullName: 'Brooke van Velden', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Brooke_van_Velden_at_2024_HASANZ_Conference_%28cropped%29.jpg' },
  { fullName: 'Nicole McKee',    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Nicole_McKee_2025_%28cropped%29.jpg' },
  { fullName: 'Todd Stephenson', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Todd_Stephenson.jpg/250px-Todd_Stephenson.jpg' },
  { fullName: 'Andrew Hoggard',  photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Andrew_Hoggard_drinking_2024_%28cropped%29.jpg/250px-Andrew_Hoggard_drinking_2024_%28cropped%29.jpg' },
  { fullName: 'Karen Chhour',    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Karen_Chhour_2023_%28cropped%29.jpg/250px-Karen_Chhour_2023_%28cropped%29.jpg' },
  { fullName: 'Simon Court',     photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Simon_Court%2C_2025.jpg/250px-Simon_Court%2C_2025.jpg' },
  // NZ First
  { fullName: 'Winston Peters',  photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Winston_Peters_2024_US_Deputy_Secretary_visit_%28further_crop%29.jpg/250px-Winston_Peters_2024_US_Deputy_Secretary_visit_%28further_crop%29.jpg' },
  { fullName: 'Shane Jones',     photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Shane_Jones_2018_5.jpg/250px-Shane_Jones_2018_5.jpg' },
  { fullName: 'Casey Costello',  photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Casey_Costello_November_2024.jpg' },
  { fullName: 'Mark Patterson',  photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Mark_Patterson_2019.jpg/250px-Mark_Patterson_2019.jpg' },
  { fullName: 'Jenny Marcroft',  photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Jenny_Marcroft_%28cropped%29.jpg' },
  { fullName: 'Andy Foster',     photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Official_photo_of_Andy_Foster.png' },
  { fullName: 'Tanya Unkovich',  photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Tanya_Unkovich.jpg/250px-Tanya_Unkovich.jpg' },
];

async function main() {
  console.log('\n🖼️  Updating images...\n');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('✅  Connected to MongoDB\n');

  console.log(`📦 Updating ${PARTY_LOGOS.length} party logos...`);
  for (const { slug, logoUrl } of PARTY_LOGOS) {
    const res = await Party.updateOne({ slug }, { $set: { logoUrl } });
    console.log(`   ${res.matchedCount ? '✓' : '⚠ not found'} ${slug}`);
  }

  console.log(`\n👤 Updating ${MP_PHOTOS.length} MP photos...`);
  for (const { fullName, photoUrl } of MP_PHOTOS) {
    const res = await MP.updateOne({ fullName }, { $set: { photoUrl } });
    console.log(`   ${res.matchedCount ? '✓' : '⚠ not found'} ${fullName}`);
  }

  console.log('\n🎉 Done!\n');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
