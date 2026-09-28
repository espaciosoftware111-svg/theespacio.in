import dotenv from 'dotenv';
dotenv.config();
import { query } from '../config/supabase.js';

async function run() {
  const res = await query('SELECT * FROM projects ORDER BY "order" ASC NULLS LAST, id ASC');
  console.log('Total projects:', res.rows.length);
  res.rows.forEach((p, idx) => {
    console.log(`[${idx+1}] ID: ${p.id} | Title: ${p.title} | Category: ${p.category} | Hero: ${p.heroImage || p.image}`);
    if (Array.isArray(p.gallery)) {
      console.log(`     Gallery (${p.gallery.length} items):`, p.gallery.slice(0, 3));
    }
  });
  process.exit(0);
}
run();
