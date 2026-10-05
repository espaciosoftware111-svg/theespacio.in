import dotenv from 'dotenv';
dotenv.config();
import { query } from '../config/supabase.js';

async function check() {
  const res = await query('SELECT * FROM projects WHERE id = \'proj_8_kachiguda_subbarao\' OR slug = \'kachiguda-fusion-duplex-villa\'');
  console.log('Found rows:', res.rows.length);
  if (res.rows.length > 0) {
    const row = res.rows[0];
    console.log('Keys:', Object.keys(row));
    console.log('ID:', row.id);
    console.log('Slug:', row.slug);
    console.log('Title:', row.title);
    console.log('Hero:', row.hero_image || row.heroimage || row.heroImage);
    console.log('Gallery length:', row.gallery ? row.gallery.length : 0);
    console.log('Gallery:', JSON.stringify(row.gallery, null, 2));
    console.log('Before_after:', JSON.stringify(row.before_after, null, 2));
    if (row.data) {
      const d = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      console.log('data.rooms length:', d.rooms ? d.rooms.length : 0);
      if (d.rooms) {
        console.log('data.rooms:', JSON.stringify(d.rooms, null, 2));
      }
    }
  }
  process.exit(0);
}
check().catch(console.error);
