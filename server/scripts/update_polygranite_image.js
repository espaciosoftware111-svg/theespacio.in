import { query } from '../config/supabase.js';

async function updatePolygranite() {
  const newUrl = 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/polygranite_ujh0zb.png';
  try {
    const res = await query(
      `UPDATE products SET hero_image = $1, image = $1, updated_at = NOW() WHERE slug = $2 RETURNING id, slug, hero_image`,
      [newUrl, 'digital-korean-poly-granite']
    );
    console.log('Successfully updated polygranite in DB:', res.rows);
    process.exit(0);
  } catch (err) {
    console.error('Failed to update polygranite in DB:', err);
    process.exit(1);
  }
}

updatePolygranite();
