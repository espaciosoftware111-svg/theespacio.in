import dotenv from 'dotenv';
dotenv.config();
import { query } from '../config/supabase.js';

async function run() {
  try {
    const res = await query('SELECT id, slug, hero_image, gallery, before_after, data FROM projects ORDER BY "order" ASC NULLS LAST, id ASC');
    console.log(`Fetched ${res.rows.length} projects to update.`);

    for (let i = 0; i < res.rows.length; i++) {
      const p = res.rows[i];
      let gallery = Array.isArray(p.gallery) ? [...p.gallery] : [];
      if (gallery.length <= 1) {
        console.warn(`Project ${p.slug} has ${gallery.length} images; skipping removal.`);
        continue;
      }

      const oldFirst = gallery[0];
      const newGallery = gallery.slice(1);
      const newFirst = newGallery[0];

      console.log(`\n[${i+1}] ${p.slug}:`);
      console.log(`   Old 1st: ${oldFirst}`);
      console.log(`   New 1st: ${newFirst}`);
      console.log(`   Gal len: ${gallery.length} -> ${newGallery.length}`);

      // Update before_after
      let ba = Array.isArray(p.before_after) ? [...p.before_after] : [];
      if (ba.length > 0 && ba[0]) {
        ba[0].after = newFirst;
      }

      // Update data json
      let dataObj = (p.data && typeof p.data === 'object') ? { ...p.data } : {};
      dataObj.heroImage = newFirst;
      dataObj.afterImage = newFirst;
      dataObj.gallery = newGallery;
      if (ba.length > 0) dataObj.before_after = ba;

      await query(
        `UPDATE projects 
         SET hero_image = $1, 
             gallery = $2::jsonb, 
             before_after = $3::jsonb, 
             data = $4::jsonb,
             updated_at = NOW()
         WHERE id = $5`,
        [newFirst, JSON.stringify(newGallery), JSON.stringify(ba), JSON.stringify(dataObj), p.id]
      );
      console.log(`   ✓ DB updated successfully.`);
    }

    console.log('\nAll 9 projects updated in database!');
    process.exit(0);
  } catch (e) {
    console.error('Error updating projects:', e);
    process.exit(1);
  }
}

run();
