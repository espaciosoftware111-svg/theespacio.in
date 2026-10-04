import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { uploadToCloudinary } from '../utils/cloudinaryHelper.js';
import { query } from '../config/supabase.js';

const DRIVE_IMAGES = [
  { id: '1RLCfK0ALE207QfWe2p9YXQuPWCJ5WXv1', name: 'modern_wood_panelled_entrance_porch', room: 'Modern Wood-Panelled Entrance Porch' },
  { id: '1lutftg5LGQq6ewqMFB1ue_5Jzq37QGWu', name: 'warm_modern_hallway_festive_garlands', room: 'Warm Foyer & Architectural Hallway' },
  { id: '1XYBv6RDrfUvQ9SMSFG4JwyGkb6C1YLNj', name: 'living_room_fluted_feature_wall', room: 'Grand Living Lounge & Fluted Feature Wall' },
  { id: '19cWTzn_D9VjPWpOGHPdiA4y8Jtk8Fjyr', name: 'grain_matched_dining_area', room: 'Grain-Matched Veneer Dining Suite' },
  { id: '18F-72csVthp5NFRJeiLqFQg_fzPm1G5Q', name: 'double_height_staircase_jesus_mural', room: 'Double-Height Staircase & Sacred Art Mural' },
  { id: '1Bqr85Noq1u9E7U1waWjOJJT2-LiZZfj0', name: 'backlit_stone_timber_pooja_shrine', room: 'Backlit Stone & Timber Pooja Unit' },
  { id: '1cYfNCClF1geGnSykv_hHeBZX50sIhI50', name: 'calm_master_bedroom_suite', room: 'Master Bedroom Suite & Acoustic Headboard' },
  { id: '1Zhe8aYuaOsUnLXNPF5me-poRCkc3_Jzv', name: 'master_walk_in_wardrobe', room: 'Master Walk-In Wardrobe & Dressing Vanity' },
  { id: '1Vxnt2rBYwKrzo1OHRwVeBKE_wbYfHKjG', name: 'guest_bedroom_suite', room: 'Guest Bedroom Suite & Fluted Storage' },
  { id: '12NeCRJkAu_fzPYwoLvmWMMIIBuRMx30C', name: 'modern_modular_kitchen_cove', room: 'Modern Modular Kitchen & Ambient Coves' }
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
      const mimeType = response.headers['content-type'] || 'image/png';
      return `data:${mimeType};base64,${Buffer.from(response.data).toString('base64')}`;
    } catch (err) {
      console.warn(`Attempt ${attempt} for ${id} failed: ${err.message}`);
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

async function main() {
  console.log('Starting upload of Casa Alta Residence images to Cloudinary...');
  const uploadedMap = [];

  for (const item of DRIVE_IMAGES) {
    try {
      console.log(`Downloading ${item.name} (${item.id})...`);
      const base64 = await downloadDriveImageWithRetry(item.id);
      console.log(`Uploading ${item.name} to Cloudinary...`);
      const uploadRes = await uploadToCloudinary(base64, `casa_alta_${item.name}`);
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
    console.error('No images uploaded successfully.');
    return;
  }

  // Choose Grand Living Lounge or Double-Height Staircase / Entrance as hero
  const livingItem = uploadedMap.find(x => x.name.includes('living_room')) || uploadedMap[2] || uploadedMap[0];
  const heroUrl = livingItem.url;
  const galleryUrls = uploadedMap.map(x => x.url);

  console.log('\n--- UPLOAD SUMMARY ---');
  console.log(`Total images uploaded: ${uploadedMap.length}`);
  console.log(`Hero image: ${heroUrl}`);

  const projectId = 'proj_11_casa_alta_residence_kali_mandir';
  const projectSlug = 'casa-alta-residence-kali-mandir';
  const projectTitle = 'Casa Alta Residence';
  const category = 'Residential';
  const area = '2,400 sq.ft.';
  const location = 'Kali Mandir, Hyderabad';
  const year = 2026;
  const style = 'Contemporary Warm Minimalist & Timber Elegance';
  const description = 'A calm, well-balanced 3BHK home where every room feels connected to the next, from the fluted wall in the living room to the mural on the staircase. Delivered turnkey and on schedule with warm timber, stone accents, and seamless cove lighting.';

  const story = {
    vision: "The family wanted a home that feels calm and open, modern in its restraint but warm the way traditional homes are. Light, timber and stone were meant to tie the rooms together, so the house feels like one story from the front door to the bedroom.",
    challenges: "With open living and dining areas, the home needed one design language running through it. Fluted panels, veneer and stone had to meet cleanly from room to room, and the false ceiling had to carry into the wall treatments so nothing felt like a separate space.",
    solutions: "It starts in the living room, where a fluted feature wall sets the tone and grain-matched veneer carries on into the dining area. The double-height staircase is the heart of the home, with a Jesus mural rising along its wall. A backlit stone-and-timber pooja unit and a calm master suite with a walk-in wardrobe follow the same palette. Recessed warm-white coves tie every space together.",
    engineering: "Cove lighting needs ventilation gaps and safe clearances from the finishes, so we planned both in from the start. That keeps the veneer from warping or fading over time. The wardrobes and pooja unit are built on moisture-resistant boards with heavy-duty hardware made for daily use. None of this is visible once the home is finished, but it is why the home looks as good years later as it did on handover day.",
    outcome: "A calm, well-balanced home where every room feels connected to the next, from the fluted wall in the living room to the mural on the staircase. Delivered turnkey and on schedule."
  };

  const testimonial = {
    name: 'Prakash',
    role: 'Homeowner, Kali Mandir',
    text: "Espacio delivered our 3BHK with exceptional precision. The fluted paneling, timber finishes and cove lighting make every room feel connected and calm. They were transparent on costs and handed over exactly on the promised date.",
    rating: 5,
    profession: 'Homeowner, Kali Mandir'
  };

  const beforeAfter = [
    {
      before: heroUrl,
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
    beforeImage: heroUrl,
    beforeImages: [heroUrl],
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
    order: 11,
    featured: true,
    status: 'published'
  };

  console.log('\nInserting/updating project in Supabase `projects` table...');
  const upsertQuery = `
    INSERT INTO projects (
      id,
      _id,
      title,
      slug,
      category,
      area,
      location,
      year,
      style,
      description,
      story,
      hero_image,
      gallery,
      before_after,
      featured,
      "order",
      status,
      soft_delete,
      data,
      created_at,
      updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11::jsonb, $12, $13::jsonb, $14::jsonb, $15, $16, $17, $18, $19::jsonb, NOW(), NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      slug = EXCLUDED.slug,
      category = EXCLUDED.category,
      area = EXCLUDED.area,
      location = EXCLUDED.location,
      year = EXCLUDED.year,
      style = EXCLUDED.style,
      description = EXCLUDED.description,
      story = EXCLUDED.story,
      hero_image = EXCLUDED.hero_image,
      gallery = EXCLUDED.gallery,
      before_after = EXCLUDED.before_after,
      featured = EXCLUDED.featured,
      "order" = EXCLUDED."order",
      status = EXCLUDED.status,
      soft_delete = EXCLUDED.soft_delete,
      data = EXCLUDED.data,
      updated_at = NOW();
  `;

  await query(upsertQuery, [
    projectId,
    projectId,
    projectTitle,
    projectSlug,
    category,
    area,
    location,
    year,
    style,
    description,
    JSON.stringify(story),
    heroUrl,
    JSON.stringify(galleryUrls),
    JSON.stringify(beforeAfter),
    true,
    11,
    'published',
    false,
    JSON.stringify(dataObj)
  ]);

  console.log(`✓ Project successfully inserted into Supabase database as [${projectId}] / [${projectSlug}]!`);
  console.log(JSON.stringify(uploadedMap, null, 2));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
