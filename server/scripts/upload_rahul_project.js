import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import mongoose from 'mongoose';
import { uploadToCloudinary } from '../utils/cloudinaryHelper.js';
import { query } from '../config/supabase.js';
import Project from '../models/Project.js';

// Ranked order: Best high-res 1600px showcase photos at the top, detailed/lower-res at the bottom
const ORDERED_FILES = [
  // --- TIER 1: Master High-Res Showcase (1600x900) ---
  { file: '29_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_5-20260810-122237.jpg', room: 'Clean Contemporary Living Lounge & Floating TV Console', tag: 'living' },
  { file: '05_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_27-20260810-122243.jpg', room: 'Master Bedroom Suite & Bookmatched Marble Wall', tag: 'master-bedroom' },
  { file: '27_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_33-20260810-122245.jpg', room: 'Designer Sectional Lounge & Marble Coffee Table', tag: 'living' },
  { file: '20_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_1-20260810-122238.jpg', room: 'Dining Suite & Backlit Marble Ganesha Shrine', tag: 'dining' },
  { file: '16_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_20-20260810-122237.jpg', room: 'Contemporary Modular Kitchen & Breakfast Counter', tag: 'kitchen' },
  { file: '21_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_10-20260810-122233.jpg', room: 'Living Room Panorama & Natural Light Vistas', tag: 'living', isAfter: true },
  { file: '09_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_32-20260810-122244.jpg', room: 'Master Suite Symmetry & Halo LED Illumination', tag: 'master-bedroom' },
  { file: '12_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_8-20260810-122238.jpg', room: 'Celestial Kids Bedroom & Handcrafted Cosmic Mural', tag: 'kids-bedroom' },
  { file: '26_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_31-20260810-122245.jpg', room: 'Foyer Art Console & Brass Ginkgo Wall Decor', tag: 'foyer' },
  { file: '28_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_4-20260810-122232.jpg', room: 'Sanctum Pooja Mandir with Laser-Cut Om & Swastik Accents', tag: 'pooja' },
  { file: '06_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_28-20260810-122245.jpg', room: 'Master Suite Integrated PC Workstation & Wardrobe', tag: 'master-bedroom' },
  { file: '22_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_11-20260810-122233.jpg', room: 'Designer Powder Vanity & Vertical Fluted Panelling', tag: 'vanity' },
  { file: '10_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_6-20260810-122239.jpg', room: 'Kids Bedroom Bay Window Seating & Built-in Storage', tag: 'kids-bedroom' },
  { file: '07_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_29-20260810-122245.jpg', room: 'Master Bedroom Dressing Mirror & Floating Vanity', tag: 'master-bedroom' },
  { file: '11_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_7-20260810-122239.jpg', room: 'Space Explorer Bunk & Ambient Sconce Lighting', tag: 'kids-bedroom' },
  { file: '02_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_2-20260810-122236.jpg', room: 'Minimalist Study Desk & High-Gloss Display Ledge', tag: 'study' },
  { file: '23_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_12-20260810-122233.jpg', room: 'Pooja Shrine Detail & Dual-Tier Marble Pedestal', tag: 'pooja' },
  { file: '13_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_9-20260810-122235.jpg', room: 'Kids Bedroom Galaxy Headboard & Wardrobe Elevation', tag: 'kids-bedroom' },
  { file: '24_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_14-20260810-122233.jpg', room: 'Washbasin Vanity & Architectural Mirror Nook', tag: 'vanity' },
  { file: '08_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_3-20260810-122234.jpg', room: 'Study Nook Ergonomic Workspace', tag: 'study' },
  { file: '01_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_13-20260810-122234.jpg', room: 'Kids Space Suite Full Perspective', tag: 'kids-bedroom' },

  // --- TIER 2: Detail Views & Perspectives (1024x576) ---
  { file: '15_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_18-20260810-122232.jpg', room: 'Modular Kitchen Prep Zone & Stainless Cooktop', tag: 'kitchen' },
  { file: '14_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_17-20260810-122232.jpg', room: 'Kitchen Storage & Soft-Close Cutlery Drawers', tag: 'kitchen' },
  { file: '18_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_22-20260810-122232.jpg', room: 'Kitchen Wall Units & Under-Cabinet Light Detail', tag: 'kitchen' },
  { file: '17_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_21-20260810-122232.jpg', room: 'Breakfast Island Corner & Overhead Shelving', tag: 'kitchen' },
  { file: '19_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_23-20260810-122232.jpg', room: 'Granite Countertop & Backsplash Detailing', tag: 'kitchen' },
  { file: '03_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_24-20260810-122233.jpg', room: 'Kids Bedroom Wardrobe Shutter Alignment', tag: 'kids-bedroom' },
  { file: '04_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_25-20260810-122233.jpg', room: 'Kids Bedroom Perspective & Door Frame Fitout', tag: 'kids-bedroom' },
  { file: '25_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_19-20260810-122232.jpg', room: 'Dining & Kitchen Transition Perspective', tag: 'dining' }
];

async function main() {
  const inputBeforePath = 'C:/Users/shaik/.gemini/antigravity-ide/brain/cc7d9397-5e6c-4df2-a8f0-cf86d78c9ca8/.user_uploaded/media_1791050907787.jpg';
  const tempDir = path.resolve('temp_rahul');
  const localImgDir = path.resolve('client', 'public', 'images', 'projects', 'kokapet_rahul_2bhk');

  if (!fs.existsSync(localImgDir)) {
    fs.mkdirSync(localImgDir, { recursive: true });
  }

  console.log('1. Processing Before Image...');
  const beforeBuffer = fs.readFileSync(inputBeforePath);
  const localBeforeWebp = path.join(localImgDir, 'rahul_before.webp');
  await sharp(beforeBuffer).webp({ quality: 90 }).toFile(localBeforeWebp);
  console.log('  ✓ Local before webp written');

  const beforeBase64 = `data:image/jpeg;base64,${beforeBuffer.toString('base64')}`;
  const beforeCld = await uploadToCloudinary(beforeBase64, 'rahul_ivory_retreat_before');
  const beforeCloudUrl = beforeCld.secure_url;
  console.log('  ✓ Before uploaded to Cloudinary:', beforeCloudUrl);

  console.log('\n2. Processing Gallery Images in Curated Order...');
  const uploadedGallery = [];

  for (let i = 0; i < ORDERED_FILES.length; i++) {
    const item = ORDERED_FILES[i];
    const srcPath = path.join(tempDir, item.file);
    if (!fs.existsSync(srcPath)) {
      console.warn('File not found:', srcPath);
      continue;
    }

    console.log(`[${i + 1}/${ORDERED_FILES.length}] Processing ${item.file}...`);
    const fileBuffer = fs.readFileSync(srcPath);

    // Save local webp
    const localWebp = path.join(localImgDir, `rahul_gallery_${i + 1}.webp`);
    await sharp(fileBuffer).webp({ quality: 90 }).toFile(localWebp);

    // Upload to Cloudinary
    const b64 = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
    const cleanName = `rahul_ivory_retreat_${String(i + 1).padStart(2, '0')}`;
    const cldRes = await uploadToCloudinary(b64, cleanName);
    const cloudUrl = cldRes.secure_url;
    console.log(`  ✓ Cloudinary: ${cloudUrl}`);

    uploadedGallery.push({
      ...item,
      index: i + 1,
      cloudUrl,
      localPath: `/images/projects/kokapet_rahul_2bhk/rahul_gallery_${i + 1}.webp`
    });

    // If this item is the after image counterpart
    if (item.isAfter) {
      const localAfterWebp = path.join(localImgDir, 'rahul_after.webp');
      await sharp(fileBuffer).webp({ quality: 90 }).toFile(localAfterWebp);
    }
  }

  // Identify After Image
  const afterItem = uploadedGallery.find(x => x.isAfter) || uploadedGallery[0];
  const afterCloudUrl = afterItem.cloudUrl;
  console.log('\n✓ Identified After Image:', afterCloudUrl);

  const heroItem = uploadedGallery[0]; // Clean Contemporary Living Lounge & Floating TV Console
  const heroCloudUrl = heroItem.cloudUrl;
  console.log('✓ Identified Hero Image:', heroCloudUrl);

  const galleryUrls = uploadedGallery.map(x => x.cloudUrl);

  const story = {
    vision: "Rahul wanted his home to feel clean, luminous, and contemporary, with nothing crowding the space. Smooth spatial flow, high-gloss ivory surfaces, and generous modular storage were part of the vision, alongside serene private retreats. In the main bedroom, the centerpiece was a full-height bookmatched Italian marble wall behind the bed, softly illuminated to create a restful luxury retreat. For the living area, a seamless flow connects the lounge, the bespoke marble Ganesha pooja mandir, and a modern modular kitchen with breakfast counter.",
    challenges: "With an urban high-rise layout, every wardrobe shutter, floating console, and wall panel had to align with millimeter precision. We integrated recessed cove lighting along the ceilings to wash the rooms in warm illumination without lowering headroom. The marble wall in the master bedroom required custom perimeter halo channels so the natural grey veining glows elegantly after dusk.",
    solutions: "Engineered moisture-resistant HDHMR substrates, concealed heavy-load steel anchors for the floating TV credenza, seamless bookmatched marble cladding, and laser-aligned acoustic wall panelling with German Häfele soft-close hardware.",
    engineering: "The floating TV media console required specialized internal cantilever steel bracketing to bear the load invisibly. The master bedroom marble slabs were dry-laid and laser-leveled before mounting to ensure unbroken vein continuity across panels. For the kids' bedroom, acoustic underlays were installed behind custom celestial wallpaper to maintain a peaceful environment throughout the home.",
    outcome: "A luminous 2BHK sanctuary delivered turnkey and on schedule, celebrated for its flawless ivory finishes, bookmatched marble craftsmanship, and tailored modular storage."
  };

  const beforeAfter = [
    {
      before: beforeCloudUrl,
      after: afterCloudUrl
    }
  ];

  console.log('\n3. Updating Supabase database...');
  try {
    const checkRes = await query('SELECT id, slug, before_after, data FROM projects WHERE id = $1 OR slug = $2', ['proj_4_kokapet_rahul', 'kokapet-urban-2bhk']);
    console.log('Found Supabase project rows:', checkRes.rows.length);

    for (const row of checkRes.rows) {
      let currentData = {};
      if (row.data) {
        currentData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      }
      
      currentData.heroImage = heroCloudUrl;
      currentData.gallery = galleryUrls;
      currentData.beforeImage = beforeCloudUrl;
      currentData.beforeImages = [beforeCloudUrl];
      currentData.afterImage = afterCloudUrl;
      currentData.afterImages = [afterCloudUrl];
      currentData.story = story;
      currentData.before_after = beforeAfter;

      await query(`
        UPDATE projects SET
          hero_image = $1,
          gallery = $2::jsonb,
          before_after = $3::jsonb,
          data = $4::jsonb,
          updated_at = NOW()
        WHERE id = $5
      `, [
        heroCloudUrl,
        JSON.stringify(galleryUrls),
        JSON.stringify(beforeAfter),
        JSON.stringify(currentData),
        row.id
      ]);
      console.log(`✓ Updated Supabase project ${row.id}`);
    }
  } catch (err) {
    console.warn('Supabase update warning:', err.message);
  }

  // Save mapping artifact for frontend files
  fs.writeFileSync('server/temp_rahul/uploaded_gallery.json', JSON.stringify({
    beforeCloudUrl,
    afterCloudUrl,
    heroCloudUrl,
    story,
    uploadedGallery
  }, null, 2));

  console.log('\n=======================================');
  console.log('SUCCESS!');
  console.log('Total uploaded images:', uploadedGallery.length);
  console.log('Before URL:', beforeCloudUrl);
  console.log('After URL:', afterCloudUrl);
  console.log('Hero URL:', heroCloudUrl);
  console.log('=======================================');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
