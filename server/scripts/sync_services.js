import dotenv from 'dotenv';
dotenv.config();

import { query } from '../config/supabase.js';

const servicesHeroImages = [
  'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423769/hf_20260926_115135_689f37bb-4556-4b0c-825e-0586da0f2ddb.png',
  'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260928_103008_456328d7-a078-498c-9e00-4d73fd070599.png',
  'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423722/hf_20260926_115046_7312df3a-c42b-4bab-831c-c61f1a4c559a.png',
  'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423697/hf_20260926_114746_45849102-0d71-4193-bf7f-41a775d147e3.png',
  'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260928_104300_ea2f5c95-951a-49c1-b200-388396d23801.png'
];

async function run() {
  try {
    const resList = await query('SELECT value FROM settings WHERE id = $1', ['setting_services_list']);
    let servicesList = resList.rows[0]?.value || [];
    if (Array.isArray(servicesList) && servicesList.length >= 5) {
      servicesHeroImages.forEach((imgUrl, idx) => {
        if (servicesList[idx]) servicesList[idx].img = imgUrl;
      });
    }

    await query(
      `INSERT INTO settings (id, key, value, data, created_at, updated_at, created_by, updated_by)
       VALUES ('setting_services_hero_images', 'services_hero_images', $1::jsonb, $1::jsonb, NOW(), NOW(), 'admin', 'admin')
       ON CONFLICT (id) DO UPDATE
       SET value = $1::jsonb, data = $1::jsonb, updated_at = NOW(), updated_by = 'admin'`,
      [JSON.stringify(servicesHeroImages)]
    );
    console.log('setting_services_hero_images PG updated successfully');

    await query(
      `INSERT INTO settings (id, key, value, data, created_at, updated_at, created_by, updated_by)
       VALUES ('setting_services_list', 'services_list', $1::jsonb, $1::jsonb, NOW(), NOW(), 'admin', 'admin')
       ON CONFLICT (id) DO UPDATE
       SET value = $1::jsonb, data = $1::jsonb, updated_at = NOW(), updated_by = 'admin'`,
      [JSON.stringify(servicesList)]
    );
    console.log('setting_services_list PG updated successfully');

    const resSite = await query('SELECT value FROM settings WHERE id = $1', ['site_settings']);
    let siteVal = resSite.rows[0]?.value || {};
    siteVal.services_hero_images = servicesHeroImages;
    siteVal.services_list = servicesList;
    await query(
      `UPDATE settings SET value = $1::jsonb, data = $1::jsonb, updated_at = NOW() WHERE id IN ('site_settings', 'global_cms_settings')`,
      [JSON.stringify(siteVal)]
    );
    console.log('site_settings & global_cms_settings PG updated successfully');

    // Verify
    const verifyHero = await query('SELECT value FROM settings WHERE id = $1', ['setting_services_hero_images']);
    console.log('VERIFIED HERO IMAGES:', verifyHero.rows[0]?.value?.length, 'images');

    const verifyList = await query('SELECT value FROM settings WHERE id = $1', ['setting_services_list']);
    console.log('VERIFIED SERVICES LIST:', verifyList.rows[0]?.value?.map(s => ({ num: s.num, img: s.img })));

    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

run();
