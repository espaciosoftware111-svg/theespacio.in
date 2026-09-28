import dotenv from 'dotenv';
dotenv.config();
import { query } from '../config/supabase.js';

const projectImages = [
  'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425351/hf_20260926_121205_b316b4e3-2daa-4fa2-9be5-d6a0ee716587.png', // Proj 1
  'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425297/hf_20260926_121300_6a3eef61-953b-4da3-b308-15aabfa0e9d0.png', // Proj 2
  'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425270/hf_20260926_121337_1396c58b-a42d-4d86-8930-ad80832032c1.png', // Proj 3
  'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425243/hf_20260926_121353_fb8cb679-2a98-4c61-a331-b92d2ca6c9da.png', // Proj 4
  'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425214/hf_20260926_121425_c188d1e6-1db5-4729-b2a9-ad90bbddbf3a.png', // Proj 5
  'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425192/hf_20260926_121454_777edafb-9d5a-4009-bc04-3c5d0de0e534.png', // Proj 6
  'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425174/hf_20260926_121514_93ebd25a-dafd-4368-a9e6-7698e84fbc57.png', // Proj 7
  'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425174/hf_20260926_121514_93ebd25a-dafd-4368-a9e6-7698e84fbc57.png', // Proj 8
  'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/WhatsApp_Image_2026-09-28_at_4.26.36_PM.jpg'  // Proj 9
];

async function run() {
  try {
    const res = await query('SELECT * FROM projects ORDER BY "order" ASC NULLS LAST, id ASC');
    console.log(`Fetched ${res.rows.length} projects to update.`);

    for (let i = 0; i < res.rows.length; i++) {
      const p = res.rows[i];
      const newImg = projectImages[i] || projectImages[0];

      // Update gallery to place newImg at the top (except for proj_9 where user requested WhatsApp image only as thumbnail, not in interior room gallery)
      let gallery = Array.isArray(p.gallery) ? [...p.gallery] : [];
      if (p.id === 'proj_9_dimmu_chachu_residence') {
        gallery = gallery.filter(g => typeof g === 'string' && !g.includes('WhatsApp_Image_2026-09-28_at_4.26.36_PM'));
      } else {
        if (!gallery.includes(newImg)) {
          gallery = [newImg, ...gallery];
        } else {
          gallery = [newImg, ...gallery.filter(g => g !== newImg)];
        }
      }

      // Update data JSON
      let dataObj = (p.data && typeof p.data === 'object') ? { ...p.data } : {};
      dataObj.heroImage = newImg;
      dataObj.afterImage = newImg;
      dataObj.gallery = gallery;

      // Update before_after
      let ba = Array.isArray(p.before_after) ? [...p.before_after] : [];
      if (ba.length > 0 && ba[0]) {
        ba[0].after = newImg;
      }

      await query(
        `UPDATE projects 
         SET hero_image = $1, 
             gallery = $2::jsonb, 
             before_after = $3::jsonb, 
             data = $4::jsonb,
             updated_at = NOW()
         WHERE id = $5`,
        [newImg, JSON.stringify(gallery), JSON.stringify(ba), JSON.stringify(dataObj), p.id]
      );
      console.log(`Updated project [${i+1}] ${p.id} -> ${newImg}`);
    }

    // Update settings table with projects_hero_images
    const projectsHeroImages = projectImages.slice(0, 5);
    await query(
      `INSERT INTO settings (id, key, value, data, created_at, updated_at, created_by, updated_by)
       VALUES ('setting_projects_hero_images', 'projects_hero_images', $1::jsonb, $1::jsonb, NOW(), NOW(), 'admin', 'admin')
       ON CONFLICT (id) DO UPDATE
       SET value = $1::jsonb, data = $1::jsonb, updated_at = NOW(), updated_by = 'admin'`,
      [JSON.stringify(projectsHeroImages)]
    );
    console.log('setting_projects_hero_images updated in settings.');

    // Update site_settings master row
    const resSite = await query('SELECT value FROM settings WHERE id = $1', ['site_settings']);
    let siteVal = resSite.rows[0]?.value || {};
    siteVal.projects_hero_images = projectsHeroImages;
    await query(
      `UPDATE settings SET value = $1::jsonb, data = $1::jsonb, updated_at = NOW() WHERE id IN ('site_settings', 'global_cms_settings')`,
      [JSON.stringify(siteVal)]
    );
    console.log('site_settings & global_cms_settings projects_hero_images updated.');

    process.exit(0);
  } catch (e) {
    console.error('Error updating projects:', e);
    process.exit(1);
  }
}

run();
