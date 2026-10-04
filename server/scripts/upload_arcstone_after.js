import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import { uploadToCloudinary } from '../utils/cloudinaryHelper.js';
import { query } from '../config/supabase.js';

async function main() {
  const imagePath = 'C:/Users/shaik/.gemini/antigravity-ide/brain/b2670d23-574d-4a6a-89b8-891aa09f952d/.user_uploaded/media_1791048536402.png';
  
  console.log('Reading file buffer and converting to base64...');
  const buffer = fs.readFileSync(imagePath);
  const base64Data = `data:image/png;base64,${buffer.toString('base64')}`;

  console.log('Uploading new After image to Cloudinary via uploadToCloudinary...');
  const res = await uploadToCloudinary(base64Data, 'arcstone_narsingi_wardrobe_after', 'espacio_gallery');
  const afterUrl = res.secure_url;
  const beforeUrl = 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791047572/espacio_gallery/gmbbvqghe69pjdqdnxxy.jpg';

  console.log('Uploaded After URL:', afterUrl);

  const beforeAfter = [
    {
      before: beforeUrl,
      after: afterUrl
    }
  ];

  console.log('Updating Supabase database...');
  const currentRes = await query('SELECT data FROM projects WHERE id = $1', ['proj_1_rajapushpa_provincia']);
  let currentData = {};
  if (currentRes.rows.length > 0 && currentRes.rows[0].data) {
    currentData = typeof currentRes.rows[0].data === 'string' ? JSON.parse(currentRes.rows[0].data) : currentRes.rows[0].data;
  }

  currentData.afterImage = afterUrl;
  currentData.afterImages = [afterUrl];
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

  console.log('✓ Successfully updated database with new After image!');
  console.log('AFTER_URL=' + afterUrl);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
