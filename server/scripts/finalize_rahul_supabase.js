import dotenv from 'dotenv';
dotenv.config();
import { query } from '../config/supabase.js';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('temp_rahul/uploaded_data.json', 'utf8'));

const story = {
  vision: 'Rahul wanted his 2BHK to feel clean, luminous, and contemporary, with nothing crowding the space. Smooth spatial flow, high-gloss ivory surfaces, and generous modular storage were part of the vision, alongside serene private retreats. In the main bedroom, the centerpiece was a full-height bookmatched Italian marble wall behind the bed, softly illuminated to create a restful luxury retreat. For the living area, a seamless flow connects the lounge, the bespoke marble Ganesha pooja mandir, and a modern modular kitchen with breakfast counter.',
  challenges: 'With an urban high-rise layout, every wardrobe shutter, floating console, and wall panel had to align with millimeter precision. We integrated recessed cove lighting along the ceilings to wash the rooms in warm illumination without lowering headroom. The marble wall in the master bedroom required custom perimeter halo channels so the natural grey veining glows elegantly after dusk.',
  solutions: 'Engineered moisture-resistant HDHMR substrates, concealed heavy-load steel anchors for the floating TV credenza, seamless bookmatched marble cladding, and laser-aligned acoustic wall panelling with German Häfele soft-close hardware.',
  engineering: 'The floating TV media console required specialized internal cantilever steel bracketing to bear the load invisibly. The master bedroom marble slabs were dry-laid and laser-leveled before mounting to ensure unbroken vein continuity across panels. For the kids\' bedroom, acoustic underlays were installed behind custom celestial wallpaper to maintain a peaceful environment throughout the home.',
  outcome: 'A luminous 2BHK sanctuary delivered turnkey and on schedule, celebrated for its flawless ivory finishes, bookmatched marble craftsmanship, and tailored modular storage.'
};

const galleryUrls = data.items.map(x => x.url);

async function run() {
  const currentRes = await query('SELECT data FROM projects WHERE id = $1', ['proj_4_kokapet_rahul']);
  let currentData = {};
  if (currentRes.rows.length > 0 && currentRes.rows[0].data) {
    currentData = typeof currentRes.rows[0].data === 'string' ? JSON.parse(currentRes.rows[0].data) : currentRes.rows[0].data;
  }

  currentData.heroImage = data.hero;
  currentData.gallery = galleryUrls;
  currentData.beforeImage = data.before;
  currentData.beforeImages = [data.before];
  currentData.afterImage = data.after;
  currentData.afterImages = [data.after];
  currentData.story = story;
  currentData.before_after = [{ before: data.before, after: data.after }];

  await query(`
    UPDATE projects SET
      hero_image = $1,
      gallery = $2::jsonb,
      before_after = $3::jsonb,
      data = $4::jsonb,
      updated_at = NOW()
    WHERE id = $5
  `, [
    data.hero,
    JSON.stringify(galleryUrls),
    JSON.stringify([{ before: data.before, after: data.after }]),
    JSON.stringify(currentData),
    'proj_4_kokapet_rahul'
  ]);

  console.log('✓ Successfully finalized Supabase for proj_4_kokapet_rahul!');
  process.exit(0);
}

run().catch(console.error);
