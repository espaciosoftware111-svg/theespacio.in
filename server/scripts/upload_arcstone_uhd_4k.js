import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import { uploadToCloudinary } from '../utils/cloudinaryHelper.js';
import { query } from '../config/supabase.js';

async function main() {
  const beforePath = 'C:/Users/shaik/.gemini/antigravity-ide/brain/b2670d23-574d-4a6a-89b8-891aa09f952d/arcstone_before_uhd_4k.jpg';
  const afterPath = 'C:/Users/shaik/.gemini/antigravity-ide/brain/b2670d23-574d-4a6a-89b8-891aa09f952d/arcstone_after_uhd_4k.jpg';

  console.log('Reading 4K UHD buffers...');
  const beforeBuffer = fs.readFileSync(beforePath);
  const afterBuffer = fs.readFileSync(afterPath);

  const beforeBase64 = `data:image/jpeg;base64,${beforeBuffer.toString('base64')}`;
  const afterBase64 = `data:image/jpeg;base64,${afterBuffer.toString('base64')}`;

  console.log('Uploading Before 4K to Cloudinary...');
  const beforeRes = await uploadToCloudinary(beforeBase64, 'arcstone_narsingi_before_uhd_4k', 'espacio_gallery');
  console.log('Before 4K URL:', beforeRes.secure_url);

  console.log('Uploading After 4K to Cloudinary...');
  const afterRes = await uploadToCloudinary(afterBase64, 'arcstone_narsingi_after_uhd_4k', 'espacio_gallery');
  console.log('After 4K URL:', afterRes.secure_url);

  const beforeAfter = [
    {
      before: beforeRes.secure_url,
      after: afterRes.secure_url
    }
  ];

  console.log('Updating Supabase database...');
  const currentRes = await query('SELECT data FROM projects WHERE id = $1', ['proj_1_rajapushpa_provincia']);
  let currentData = {};
  if (currentRes.rows.length > 0 && currentRes.rows[0].data) {
    currentData = typeof currentRes.rows[0].data === 'string' ? JSON.parse(currentRes.rows[0].data) : currentRes.rows[0].data;
  }

  currentData.beforeImage = beforeRes.secure_url;
  currentData.beforeImages = [beforeRes.secure_url];
  currentData.afterImage = afterRes.secure_url;
  currentData.afterImages = [afterRes.secure_url];
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
    'proj_1_rajapushpa_provincia'
  ]);

  console.log('✓ Successfully updated database with UHD 4K Before & After images!');
  console.log('FINAL_BEFORE=' + beforeRes.secure_url);
  console.log('FINAL_AFTER=' + afterRes.secure_url);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
