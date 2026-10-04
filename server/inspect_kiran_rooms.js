import { query } from './config/supabase.js';

async function main() {
  const res = await query("SELECT gallery, data FROM projects WHERE id = 'proj_5_gandipet_kiran'");
  const row = res.rows[0];
  console.log('gallery:', JSON.stringify(row.gallery, null, 2));
  const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
  console.log('data keys:', Object.keys(data || {}));
  if (data?.gallery_images) {
    console.log('data.gallery_images:', data.gallery_images);
  }
}

main().catch(console.error).finally(() => process.exit(0));
