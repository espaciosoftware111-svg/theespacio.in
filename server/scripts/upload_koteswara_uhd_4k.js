import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { uploadToCloudinary } from '../utils/cloudinaryHelper.js';
import { query } from '../config/supabase.js';

async function main() {
  const sourceImage = path.resolve('client/public/images/projects/gachibowli_koteswara_2bhk/koteswara_after_hd_4k.webp');
  const targetWebP = path.resolve('client/public/images/projects/gachibowli_koteswara_2bhk/koteswara_after.webp');
  const targetJpg = path.resolve('client/public/images/projects/gachibowli_koteswara_2bhk/koteswara_after_uhd_4k.jpg');

  console.log('Writing 3840x2160 4K UHD WebP to koteswara_after.webp...');
  await sharp(sourceImage)
    .resize(3840, 2160, { kernel: 'lanczos3', fit: 'cover' })
    .sharpen({ sigma: 1, m1: 0.5, m2: 0.5 })
    .webp({ quality: 95 })
    .toFile(targetWebP);

  console.log('Writing 3840x2160 4K UHD JPG to koteswara_after_uhd_4k.jpg...');
  await sharp(sourceImage)
    .resize(3840, 2160, { kernel: 'lanczos3', fit: 'cover' })
    .sharpen({ sigma: 1, m1: 0.5, m2: 0.5 })
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(targetJpg);

  const metaWebP = await sharp(targetWebP).metadata();
  console.log('koteswara_after.webp metadata:', metaWebP.width, 'x', metaWebP.height, 'size:', fs.statSync(targetWebP).size);

  console.log('Uploading 4K UHD After to Cloudinary...');
  const jpgBuffer = fs.readFileSync(targetJpg);
  const base64 = `data:image/jpeg;base64,${jpgBuffer.toString('base64')}`;
  let cloudUrl = null;
  try {
    const uploadRes = await uploadToCloudinary(base64, 'koteswara_gachibowli_after_uhd_4k', 'espacio_gallery');
    cloudUrl = uploadRes.secure_url;
    console.log('Cloudinary 4K UHD URL:', cloudUrl);
  } catch (cldErr) {
    console.warn('Cloudinary upload warning (local asset is primary):', cldErr.message);
  }

  console.log('Updating Supabase database...');
  const localAfterUrl = '/images/projects/gachibowli_koteswara_2bhk/koteswara_after.webp';
  const beforeUrl = '/images/projects/gachibowli_koteswara_2bhk/koteswara_before.webp';
  const beforeAfter = [{ before: beforeUrl, after: localAfterUrl }];

  const currentRes = await query("SELECT data FROM projects WHERE id = 'proj_7_gachibowli_koteswara' OR slug = 'gachibowli-minimalist-beige-2bhk'");
  let currentData = {};
  if (currentRes.rows.length > 0 && currentRes.rows[0].data) {
    currentData = typeof currentRes.rows[0].data === 'string' ? JSON.parse(currentRes.rows[0].data) : currentRes.rows[0].data;
  }
  currentData.afterImage = localAfterUrl;
  currentData.afterImages = [localAfterUrl];
  currentData.before_after = beforeAfter;

  await query(`
    UPDATE projects SET
      before_after = $1::jsonb,
      data = $2::jsonb,
      updated_at = NOW()
    WHERE id = $3
  `, [
    JSON.stringify(beforeAfter),
    JSON.stringify(currentData),
    'proj_7_gachibowli_koteswara'
  ]);

  console.log('Supabase updated successfully with 4K UHD after image!');

  // Cleanup temp files
  ['client/public/images/projects/gachibowli_koteswara_2bhk/koteswara_after_gen_4k.webp',
   'client/public/images/projects/gachibowli_koteswara_2bhk/koteswara_after_hd_4k.webp'].forEach(f => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
