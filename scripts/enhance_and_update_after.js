import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

import { uploadToCloudinary } from '../server/utils/cloudinaryHelper.js';
import { query } from '../server/config/supabase.js';

async function main() {
  console.log('=== Step 1: Enhancing Living Room Image to 4K UHD (3840x2160) ===');
  
  const sourcePath = path.resolve('temp_subbarao_new/img_16_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_21-20260813-110616.jpg');
  const targetDir = path.resolve('client/public/images/projects/kachiguda_subbarao_duplex');
  const targetWebpPath = path.join(targetDir, 'subbarao_after.webp');

  // Verify source exists
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }

  // 4K UHD processing: 3840 x 2160 with Lanczos3, subtle tone enhancement, and unsharp mask
  console.log('Processing with Sharp at 3840x2160 lanczos3...');
  const enhanced4kBuffer = await sharp(sourcePath)
    .resize({
      width: 3840,
      height: 2160,
      fit: 'cover',
      kernel: sharp.kernel.lanczos3
    })
    .modulate({
      brightness: 1.01,
      saturation: 1.04
    })
    .sharpen({
      sigma: 1.1,
      m1: 0.5,
      m2: 0.5
    })
    .webp({
      quality: 96,
      effort: 6
    })
    .toBuffer();

  // Save to client public folder
  fs.writeFileSync(targetWebpPath, enhanced4kBuffer);
  const stats = fs.statSync(targetWebpPath);
  console.log(`✓ Saved 4K WebP to ${targetWebpPath} (${Math.round(stats.size / 1024)} KB)`);

  // Prepare high-quality JPEG buffer for Cloudinary upload
  console.log('Preparing high-res JPEG for Cloudinary...');
  const jpeg4kBuffer = await sharp(enhanced4kBuffer)
    .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
    .toBuffer();

  console.log('=== Step 2: Uploading 4K Enhanced Image to Cloudinary ===');
  const base64 = `data:image/jpeg;base64,${jpeg4kBuffer.toString('base64')}`;
  const uploadResult = await uploadToCloudinary(base64, `kachiguda_subbarao_4k_living_after_${Date.now()}`);
  console.log(`✓ Cloudinary Upload Successful: ${uploadResult.secure_url}`);
  console.log(`  Dimensions: ${uploadResult.width}x${uploadResult.height}`);

  const newAfterUrl = uploadResult.secure_url;

  console.log('=== Step 3: Updating Supabase Database for kachiguda-fusion-duplex-villa ===');
  const beforeUrl = 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176785/espacio_gallery/blohvaxle28zo18l7lug.jpg';
  const newBeforeAfter = [{ before: beforeUrl, after: newAfterUrl }];

  // Fetch current data
  const selRes = await query("SELECT data FROM projects WHERE slug = 'kachiguda-fusion-duplex-villa' OR id = 'proj_8_kachiguda_subbarao'");
  let currentData = {};
  if (selRes.rows.length > 0 && selRes.rows[0].data) {
    currentData = typeof selRes.rows[0].data === 'string' ? JSON.parse(selRes.rows[0].data) : selRes.rows[0].data;
  }

  const updatedData = {
    ...currentData,
    afterImage: newAfterUrl,
    afterImages: [newAfterUrl],
    before_after: newBeforeAfter
  };

  const updateRes = await query(`
    UPDATE projects 
    SET before_after = $1::jsonb,
        data = $2::jsonb,
        updated_at = NOW()
    WHERE slug = 'kachiguda-fusion-duplex-villa' OR id = 'proj_8_kachiguda_subbarao'
    RETURNING id, slug
  `, [JSON.stringify(newBeforeAfter), JSON.stringify(updatedData)]);

  console.log('✓ Supabase DB Updated for:', updateRes.rows);

  console.log('=== Step 4: Updating subbarao_processed_manifest.json ===');
  const manifestPath = path.resolve('server/scripts/subbarao_processed_manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.afterImage = newAfterUrl;
    if (manifest.before_after) {
      manifest.before_after = newBeforeAfter;
    }
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log('✓ Updated subbarao_processed_manifest.json');
  }

  console.log('\nSUCCESS! New 4K After URL:', newAfterUrl);
  return newAfterUrl;
}

main().then(url => {
  console.log('Finished with URL:', url);
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
