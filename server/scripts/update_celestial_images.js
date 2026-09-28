import { query } from '../config/supabase.js';

async function run() {
  const newHero = 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423769/hf_20260926_115135_689f37bb-4556-4b0c-825e-0586da0f2ddb.png';
  const targetId = 'proj_9_dimmu_chachu_residence';

  const res = await query('SELECT data FROM projects WHERE id = $1 OR _id = $1', [targetId]);
  if (res.rows && res.rows[0]) {
    const data = res.rows[0].data;
    data.heroImage = newHero;
    data.hero_image = newHero;
    data.afterImage = newHero;
    if (Array.isArray(data.afterImages)) data.afterImages = [newHero];
    if (Array.isArray(data.before_after) && data.before_after[0]) {
      data.before_after[0].after = newHero;
    }
    if (Array.isArray(data.gallery)) {
      data.gallery = data.gallery.filter(g => typeof g === 'string' && !g.includes('WhatsApp_Image_2026-09-28_at_4.26.36_PM'));
      if (!data.gallery.includes(newHero)) {
        data.gallery.unshift(newHero);
      }
    }

    await query('UPDATE projects SET data = $1, hero_image = $2 WHERE id = $3 OR _id = $3', [data, newHero, targetId]);
    console.log('Successfully updated Celestial Curve Villa in PostgreSQL:');
    console.log('Hero:', data.heroImage);
    console.log('Gallery count:', data.gallery.length);
  } else {
    console.log('Project not found in DB');
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
