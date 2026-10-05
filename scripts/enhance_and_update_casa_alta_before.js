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
  console.log('=== Step 1: Enhancing Casa Alta Bedroom Before Image to UHD 4K (3840x2160) ===');
  
  const sourcePath = path.resolve('C:/Users/shaik/.gemini/antigravity-ide/brain/d0c0d373-689a-490f-b418-ec80276c9cb6/.user_uploaded/media_1791182124312.jpg');
  const targetDir = path.resolve('client/public/images/projects/casa_alta_kali_mandir');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const targetWebpPath = path.join(targetDir, 'casa_alta_before.webp');

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }

  // 4K UHD processing: 3840 x 2160 with Lanczos3, unsharp masking, contrast optimization
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
      sigma: 1.2,
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

  console.log('=== Step 2: Uploading UHD 4K Enhanced Before Image to Cloudinary ===');
  const base64 = `data:image/jpeg;base64,${jpeg4kBuffer.toString('base64')}`;
  const uploadResult = await uploadToCloudinary(base64, `casa_alta_kali_mandir_uhd_4k_before_${Date.now()}`);
  console.log(`✓ Cloudinary Upload Successful: ${uploadResult.secure_url}`);
  console.log(`  Dimensions: ${uploadResult.width}x${uploadResult.height}`);

  const newBeforeUrl = uploadResult.secure_url;
  const afterUrl = 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040114/espacio_gallery/ues8rn6ddd052rkmlesl.png';

  console.log('=== Step 3: Updating Supabase Database for casa-alta-residence-kali-mandir ===');
  const selRes = await query("SELECT data, before_after FROM projects WHERE slug = 'casa-alta-residence-kali-mandir' OR id = 'proj_11_casa_alta_residence_kali_mandir'");
  let currentData = {};

  if (selRes.rows.length > 0) {
    if (selRes.rows[0].data) {
      currentData = typeof selRes.rows[0].data === 'string' ? JSON.parse(selRes.rows[0].data) : selRes.rows[0].data;
    }
  }

  const newBeforeAfter = [{ before: newBeforeUrl, after: afterUrl }];

  const updatedData = {
    ...currentData,
    beforeImage: newBeforeUrl,
    beforeImages: [newBeforeUrl],
    afterImage: afterUrl,
    afterImages: [afterUrl],
    before_after: newBeforeAfter
  };

  const updateRes = await query(`
    UPDATE projects 
    SET before_after = $1::jsonb,
        data = $2::jsonb,
        updated_at = NOW()
    WHERE slug = 'casa-alta-residence-kali-mandir' OR id = 'proj_11_casa_alta_residence_kali_mandir'
    RETURNING id, slug
  `, [JSON.stringify(newBeforeAfter), JSON.stringify(updatedData)]);

  console.log('✓ Supabase DB Updated for:', updateRes.rows);

  console.log('\nSUCCESS! New UHD 4K Before URL:', newBeforeUrl);
  return { newBeforeUrl, afterUrl };
}

main().then(res => {
  console.log('Finished with Before URL:', res.newBeforeUrl);
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
