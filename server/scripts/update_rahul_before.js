import { query } from '../config/supabase.js';

async function main() {
  const newBeforeUrl = 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791117122/espacio_gallery/zjc83xwzwjrijgnbto2z.jpg';
  const checkRes = await query('SELECT id, slug, before_after, data FROM projects WHERE id = $1 OR slug = $2', ['proj_4_kokapet_rahul', 'kokapet-urban-2bhk']);
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
      currentData.before_after = [{ before: newBeforeUrl, after: currentData.afterImage || 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051307/espacio_gallery/xeip5cg3agnlqw7rtymo.jpg' }];
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
