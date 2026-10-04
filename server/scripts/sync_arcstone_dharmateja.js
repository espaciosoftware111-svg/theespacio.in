import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { uploadToCloudinary } from '../utils/cloudinaryHelper.js';
import { query } from '../config/supabase.js';

const DRIVE_IMAGES = [
  // Best Hall images at the top
  { id: '1rzVWbM0jk-oDkCmQMJEc3lU-IAzthNuO', name: 'arcstone_narsingi_hall_main', room: 'Grand Living Lounge & Arched Feature Wall' },
  { id: '1pU56QApVucsbXCiySvAR8qaMHtJ4lqdx', name: 'arcstone_narsingi_hall_2', room: 'Living Lounge & Arched Feature Nook' },
  { id: '1ryyAr0zf2hGzvb1qTiiG1XLGgeXEVH5G', name: 'arcstone_narsingi_hall_3', room: 'Sculpted TV Media Wall & Fluted Panelling' },
  { id: '1p1ceBfMKTHcXwfCGyM9dRSg_2Khhp_pt', name: 'arcstone_narsingi_hall_4', room: 'Open Dining Area & Fluted Transition' },
  { id: '1DClyNRURhfJQ5wnQwnlQIcZj4loc0Xs8', name: 'arcstone_narsingi_hall_5', room: 'Living Lounge & Ambient Cove Lighting' },

  // Master Bedroom Suite & Walk-In Closets
  { id: '1g6Yd4l1q6pOJsp80COQJjJv2CQJKVTzF', name: 'arcstone_narsingi_mbr_main', room: 'Master Bedroom & Curved Feature Wall' },
  { id: '1_ImoclDHILWk3gzdx9mOGtoHAERem8bQ', name: 'arcstone_narsingi_mbr_2', room: 'Master Suite with Chandelier & Glass Wardrobes' },
  { id: '1Qlu-ZZ0V8PlmVsphz5okd23XchqIrQYe', name: 'arcstone_narsingi_mbr_3', room: 'Master Suite Media Wall & Study Nook' },
  { id: '1OjsPc4ylHzmwl2cIGqxKPOTzJRhwq6sn', name: 'arcstone_narsingi_mbr_4', room: 'Master Bedroom Suite & Ambient Cove Lighting' },
  { id: '1dkyWQW2ADdtWU_m27t8NzNYQlwNxLOms', name: 'arcstone_narsingi_wic_main', room: 'Master Walk-In Wardrobe & Fluted Closets' },
  { id: '1jYa0H_CMtJbs9KwvtvKAtU4W0GI6YHye', name: 'arcstone_narsingi_wic_2', room: 'Walk-In Wardrobe & Dressing Vanity' },

  // Modular Kitchen & Pooja Mandir
  { id: '1pjD1c-XXvVzReWzexjtlgV_xUl1Z4Ku5', name: 'arcstone_narsingi_kitchen_main', room: 'Modular Kitchen & Quartz Countertops' },
  { id: '189Qpn6dscNhcRyp4tTXfSzj1hPKTe4qk', name: 'arcstone_narsingi_kitchen_2', room: 'L-Shaped Modular Kitchen & Fluted Cabinetry' },
  { id: '1lE6ntuMrrzaNrbhyx07SUiMz4wa6OGeQ', name: 'arcstone_narsingi_puja_main', room: 'Pooja Mandir & Foyer Transition' },

  // Guest Bedroom Suite
  { id: '1W1ERuQQPW6b0vr6Us64nVlgZiq7MG_Ci', name: 'arcstone_narsingi_gbr_main', room: 'Guest Bedroom Suite & Arched Wall Accents' },
  { id: '1ir3ISPWKKnppY_ixpZZyd_x7UINeFLgR', name: 'arcstone_narsingi_gbr_2', room: 'Guest Bedroom Suite & Backlit Headboard' },
  { id: '1nMzQfDpn25bFZ8hbWWcoDa-GCOU1udT5', name: 'arcstone_narsingi_gbr_3', room: 'Guest Dressing Vanity & Wardrobes' },

  // Kids / Bedroom Suite
  { id: '1CIY_EJCGlUH1tq_CdhF8XeKlq0o1nkz0', name: 'arcstone_narsingi_bedroom_main', room: 'Kids Bedroom Suite & Custom Headboard' },
  { id: '1Ljq6TrNj_k6zXaaLtH8vmSC2j4RWZM6v', name: 'arcstone_narsingi_bedroom_2', room: 'Kids Bedroom Wardrobes & Study Desk' },

  // Utility at the bottom
  { id: '1TEnOUpPktvSKsJ_pX_oaKcB-eAeg3_CT', name: 'arcstone_narsingi_utility', room: 'Utility & Laundry Suite' }
];

async function downloadDriveImageWithRetry(id, maxRetries = 3) {
  const url = `https://lh3.googleusercontent.com/d/${id}`;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 35000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      const mimeType = response.headers['content-type'] || 'image/jpeg';
      return `data:${mimeType};base64,${Buffer.from(response.data).toString('base64')}`;
    } catch (err) {
      console.warn(`Attempt ${attempt} for ${id} failed: ${err.message}`);
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

async function uploadLocalBeforeImage() {
  const localPath = 'C:/Users/shaik/.gemini/antigravity-ide/brain/b2670d23-574d-4a6a-89b8-891aa09f952d/.user_uploaded/media_1791047375319.jpg';
  console.log('Uploading local before image to Cloudinary...');
  const fileBuffer = fs.readFileSync(localPath);
  const base64 = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
  const uploadRes = await uploadToCloudinary(base64, 'arcstone_narsingi_before_site_shell');
  const beforeUrl = uploadRes.secure_url || uploadRes.url;
  console.log(`✓ Before image uploaded: ${beforeUrl}`);
  return beforeUrl;
}

async function main() {
  console.log('=== SYNCING DHARMA TEJA / THE ARCSTONE RESIDENCE (NARSINGI) ===');
  
  // 1. Upload Before Image
  const beforeUrl = await uploadLocalBeforeImage();

  // 2. Upload Drive Gallery Images
  const uploadedMap = [];
  for (const item of DRIVE_IMAGES) {
    try {
      console.log(`Downloading ${item.name} (${item.id})...`);
      const base64 = await downloadDriveImageWithRetry(item.id);
      console.log(`Uploading ${item.name} to Cloudinary...`);
      const uploadRes = await uploadToCloudinary(base64, item.name);
      const cloudUrl = uploadRes.secure_url || uploadRes.url;
      console.log(`✓ Uploaded: ${cloudUrl}`);
      uploadedMap.push({
        ...item,
        url: cloudUrl
      });
    } catch (err) {
      console.error(`Failed to process ${item.name}:`, err.message);
    }
  }

  if (uploadedMap.length === 0) {
    console.error('No gallery images uploaded successfully.');
    return;
  }

  const heroUrl = uploadedMap[0].url; // Grand Living Lounge & Arched Feature Wall
  const galleryUrls = uploadedMap.map(x => x.url);

  console.log('\n--- UPLOAD SUMMARY ---');
  console.log(`Total images uploaded: ${uploadedMap.length}`);
  console.log(`Hero image: ${heroUrl}`);
  console.log(`Before image: ${beforeUrl}`);

  const projectId = 'proj_1_rajapushpa_provincia'; // keep primary key intact
  const projectSlug = 'rajapushpa-provincia-3bhk'; // slug kept for existing bookmarks, with narsingi aliases added
  const projectTitle = 'The Arcstone Residence, Narsingi';
  const category = 'apartment';
  const area = '2,850 sq.ft.';
  const location = 'Narsingi, Hyderabad';
  const year = 2026;
  const style = 'Contemporary Warm Minimalist';
  const description = 'Warm wood tones, sculpted feature walls, and hidden lighting that transforms the mood room to room — this 3BHK in Narsingi turns every corner into something worth showing off. Every finish built to stay flawless for years, not just on move-in day.';

  const story = {
    vision: "The brief was clear from day one: give Dharma Teja a living room that feels warm and welcoming the moment you walk in — never stiff, never showroom-y. We planned to bring in wood paneling with a soft vertical texture, pair it with a marble-look backdrop behind the TV, and layer the ceiling with gentle cove lighting that could shift the whole mood of the room after sunset. A statement chandelier ties the space together — designed to work just as well for a quiet evening in as it does when guests are over.",
    challenges: "The trickiest part was the feature wall with arched niches in Narsingi. Getting that wall to look like one flowing design, instead of separate shapes stuck together, took careful planning. Every arch had to line up, every light strip had to sit exactly right, and the wall itself was not flat to begin with — requiring precision backer leveling while keeping the final look completely smooth.",
    solutions: "Engineered custom lightweight composite backer structures with laser-guided leveling and integrated concealed magnetic shadowline profiles across the living and dining spaces.",
    engineering: "None of that effortless look happens by accident. Behind that wall is hidden wiring, precisely cut stone panels, and layered plasterwork — all planned out before installation, so nothing pokes through and nothing looks patched together later. Built to remain flawless for years to come.",
    outcome: "An impeccably detailed residential benchmark in Narsingi with zero visible hardware, ambient mood scenes, and seamless spatial flow delivered on schedule for Dharma Teja."
  };

  const testimonial = {
    name: 'Dharma Teja',
    role: 'Homeowner, Narsingi, Hyderabad',
    text: "The sheer structural rigor and high-tolerance wood joinery delivered by Espacio was benchmark quality. The curved feature walls, modular kitchen, and custom mood lighting turned our residence in Narsingi into an architectural trophy. Highly recommended for turnkey luxury interiors!",
    rating: 5,
    profession: 'Homeowner, Narsingi'
  };

  const beforeAfter = [
    {
      before: beforeUrl,
      after: heroUrl
    }
  ];

  const dataObj = {
    _id: projectId,
    id: projectId,
    title: projectTitle,
    slug: projectSlug,
    category: category,
    area: area,
    location: location,
    year: year,
    style: style,
    description: description,
    hero_image: heroUrl,
    heroImage: heroUrl,
    afterImage: heroUrl,
    afterImages: [heroUrl],
    beforeImage: beforeUrl,
    beforeImages: [beforeUrl],
    gallery: galleryUrls,
    galleryImages: galleryUrls,
    gallery_images: galleryUrls,
    before_after: beforeAfter,
    story: story,
    testimonial: testimonial,
    testimonialName: testimonial.name,
    testimonialText: testimonial.text,
    testimonialRating: testimonial.rating,
    testimonialProfession: testimonial.profession,
    order: 1,
    featured: true,
    status: 'published'
  };

  console.log('\nUpdating project in Supabase `projects` table...');
  const updateQuery = `
    UPDATE projects SET
      title = $1,
      area = $2,
      location = $3,
      year = $4,
      style = $5,
      description = $6,
      story = $7::jsonb,
      hero_image = $8,
      gallery = $9::jsonb,
      before_after = $10::jsonb,
      data = $11::jsonb,
      updated_at = NOW()
    WHERE id = $12
  `;

  await query(updateQuery, [
    projectTitle,
    area,
    location,
    year,
    style,
    description,
    JSON.stringify(story),
    heroUrl,
    JSON.stringify(galleryUrls),
    JSON.stringify(beforeAfter),
    JSON.stringify(dataObj),
    projectId
  ]);

  console.log(`✓ Project successfully updated in Supabase database!`);
  console.log('\nUploaded image mappings:');
  console.log(JSON.stringify(uploadedMap, null, 2));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
