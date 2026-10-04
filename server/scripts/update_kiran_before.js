import { query } from '../config/supabase.js';

async function main() {
  const newBeforeUrl = 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791132839/espacio_gallery/mysq2iymi1lwd2lgk5v0.jpg';
  const checkRes = await query('SELECT id, slug, before_after, data FROM projects WHERE id = $1 OR slug = $2', ['proj_5_gandipet_kiran', 'gandipet-modern-retro-2bhk']);
  console.log('Found Supabase project rows:', checkRes.rows.length);

  for (const row of checkRes.rows) {
    let currentData = {};
    if (row.data) {
      currentData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    }
    
    currentData.beforeImage = newBeforeUrl;
    currentData.beforeImages = [newBeforeUrl];
    if (Array.isArray(currentData.before_after) && currentData.before_after.length > 0) {
      currentData.before_after[0].before = newBeforeUrl;
    } else {
      currentData.before_after = [{ before: newBeforeUrl, after: currentData.afterImage || 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/5d678d57-3ff6-4ce4-87fb-29b692a0cf84.png' }];
    }

    const beforeAfter = currentData.before_after;

    await query(`
      UPDATE projects SET
        before_after = $1::jsonb,
        data = $2::jsonb,
        updated_at = NOW()
      WHERE id = $3
    `, [
      JSON.stringify(beforeAfter),
      JSON.stringify(currentData),
      row.id
    ]);
    console.log('✓ Updated Supabase project:', row.id);
  }
}

main().catch(console.error).finally(() => process.exit(0));
