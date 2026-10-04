import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import mongoose from 'mongoose';
import { uploadToCloudinary } from '../utils/cloudinaryHelper.js';
import { query, pool } from '../config/supabase.js';
import Project from '../models/Project.js';

async function main() {
  const inputPath = 'C:/Users/shaik/.gemini/antigravity-ide/brain/cc7d9397-5e6c-4df2-a8f0-cf86d78c9ca8/.user_uploaded/media_1791050163428.jpg';
  
  if (!fs.existsSync(inputPath)) {
    throw new Error('Source image not found: ' + inputPath);
  }

  console.log('Reading source image from:', inputPath);
  const buffer = fs.readFileSync(inputPath);

  // 1. Save optimized WebP to local public folder
  const clientPublicPath = path.resolve(process.cwd(), 'client', 'public', 'images', 'projects', 'my_home_sayuk', 'sayuk_before_raw.webp');
  console.log('Generating local webp at:', clientPublicPath);
  await sharp(buffer)
    .webp({ quality: 90 })
    .toFile(clientPublicPath);
  console.log('✓ Local webp updated successfully!');

  // 2. Upload to Cloudinary
  console.log('Uploading to Cloudinary...');
  const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
  const uploadRes = await uploadToCloudinary(base64, 'sayuk_lattice_retreat_before');
  const cloudUrl = uploadRes.secure_url;
  console.log('✓ Uploaded to Cloudinary:', cloudUrl);

  // 3. Update Supabase
  console.log('Updating Supabase database...');
  try {
    const checkRes = await query('SELECT id, slug, before_after, data FROM projects WHERE id = $1 OR slug = $2', ['proj_2_my_home_sayuk', 'my-home-sayuk-3bhk']);
    console.log('Found Supabase project rows:', checkRes.rows.length);

    for (const row of checkRes.rows) {
      let currentData = {};
      if (row.data) {
        currentData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      }
      
      const afterUrl = currentData.afterImage || (Array.isArray(row.before_after) && row.before_after[0]?.after) || 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/v1790791043/2557add0-0cc5-4a63-9062-4f49eff9978a.png';
      
      currentData.beforeImage = cloudUrl;
      currentData.beforeImages = [cloudUrl];
      currentData.afterImage = afterUrl;
      currentData.afterImages = [afterUrl];
      
      const beforeAfter = [
        {
          before: cloudUrl,
          after: afterUrl
        }
      ];
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
        row.id
      ]);
      console.log(`✓ Updated Supabase project ${row.id}`);
    }
  } catch (err) {
    console.warn('Supabase update warning:', err.message);
  }

  // 4. Update MongoDB if connected
  if (process.env.MONGODB_URI) {
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      const p = await Project.findOne({
        $or: [
          { slug: 'my-home-sayuk-3bhk' },
          { title: { $regex: 'Lattice Retreat', $options: 'i' } }
        ]
      });
      if (p) {
        p.beforeImage = cloudUrl;
        p.beforeImages = [cloudUrl];
        if (p.beforeAfter && p.beforeAfter.length > 0) {
          p.beforeAfter[0].before = cloudUrl;
        } else {
          p.beforeAfter = [{ before: cloudUrl, after: p.afterImage || '' }];
        }
        await p.save();
        console.log('✓ Updated MongoDB project:', p.title);
      } else {
        console.log('No matching MongoDB project found.');
      }
    } catch (err) {
      console.warn('MongoDB update skipped / error:', err.message);
    } finally {
      await mongoose.disconnect();
    }
  }

  console.log('\n=======================================');
  console.log('SUCCESS!');
  console.log('Cloudinary URL:', cloudUrl);
  console.log('=======================================');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
