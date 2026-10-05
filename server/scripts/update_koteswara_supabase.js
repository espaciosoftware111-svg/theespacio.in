import dotenv from 'dotenv';
dotenv.config();
import { query } from '../config/supabase.js';

const heroImage = '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_26.webp';
const beforeImage = '/images/projects/gachibowli_koteswara_2bhk/koteswara_before.webp';
const afterImage = '/images/projects/gachibowli_koteswara_2bhk/koteswara_after.webp';

const gallery = [
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_26.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_28.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_14.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_15.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_20.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_22.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_5.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_10.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_23.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_24.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_27.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_13.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_21.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_4.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_6.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_8.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_11.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_25.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_18.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_17.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_16.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_19.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_3.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_2.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_12.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_7.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_9.webp',
  '/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_1.webp'
];

async function run() {
  try {
    const res = await query("SELECT * FROM projects WHERE id = 'proj_7_gachibowli_koteswara' OR slug = 'gachibowli-minimalist-beige-2bhk'");
    if (res.rows.length === 0) {
      console.log('Project 7 not found in DB');
      process.exit(1);
    }
    const p = res.rows[0];
    let dataObj = (p.data && typeof p.data === 'object') ? { ...p.data } : {};
    dataObj.heroImage = heroImage;
    dataObj.beforeImage = beforeImage;
    dataObj.afterImage = afterImage;
    dataObj.beforeImages = [beforeImage];
    dataObj.afterImages = [afterImage];
    dataObj.gallery = gallery;

    const baArray = [{ before: beforeImage, after: afterImage }];

    await query(
      `UPDATE projects
       SET hero_image = $1,
           gallery = $2::jsonb,
           before_after = $3::jsonb,
           data = $4::jsonb,
           updated_at = NOW()
       WHERE id = $5`,
      [heroImage, JSON.stringify(gallery), JSON.stringify(baArray), JSON.stringify(dataObj), p.id]
    );

    console.log(`Successfully updated ${p.id} in Supabase with ${gallery.length} images.`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to update Supabase:', err);
    process.exit(1);
  }
}

run();
