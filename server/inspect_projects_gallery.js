import { query } from './config/supabase.js';

async function main() {
  const res = await query('SELECT id, slug, title, jsonb_array_length(gallery) as gallery_len, gallery FROM projects ORDER BY created_at ASC');
  for (const row of res.rows) {
    console.log(row.id, row.slug, row.title, row.gallery_len);
  }
}

main().catch(console.error).finally(() => process.exit(0));
