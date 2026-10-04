import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { uploadToCloudinary } from '../utils/cloudinaryHelper.js';
import { query } from '../config/supabase.js';

const DRIVE_IMAGES = [
  { id: '1xexNf66fUxRqneNROuei006rqOf7NwoJ', name: 'modern_living_space_walnut_partition', room: 'Living Lounge & Walnut Partition' },
  { id: '1Ctj327YOBTHnD0EKo0c8AqT9QuKkahJh', name: 'walnut_slats_and_marble_glow', room: 'Slatted Dining Partition & Ambient Marble' },
  { id: '1Marh9n1RTQo4-zVV3xGW_yFP8W2CQPsp', name: 'polished_modern_living_kitchen', room: 'Open-Concept Living & Kitchen Transition' },
  { id: '1VaUaRXbHjV5hBAVdGybvb55Z7lu3Zi9i', name: 'bright_modern_l_shaped_kitchen', room: 'Bright L-Shaped Modular Kitchen' },
  { id: '1v_EI-3hIMULtzP6A37ZHuGjLRU8eYtdX', name: 'modern_kitchen_wood_accents', room: 'Modular Kitchen Cabinetry with Warm Wood Accents' },
  { id: '1U15tiiUe-X-QvbVXRT0Mi63qu0YrzmOy', name: 'modern_teal_marble_kitchen', room: 'Teal & Marble Accent Kitchen' },
  { id: '1FJXNR12DFu_BuopwuyXHvjVwN8DywZd9', name: 'warmly_lit_modern_home_shrine', room: 'Warmly Lit Modern Home Shrine' },
  { id: '1lzeirdiIMuafFcWGOgqVpxZco9idjPQ-', name: 'ornate_white_panels_glowing_om', room: 'Pooja Mandir with Glowing Om Feature' },
  { id: '17JOVWNsGURMWj_HxuwVIbawFasYbVzuI', name: 'modern_pooja_cabinet_kitchen', room: 'Integrated Pooja Mandir & Kitchen' },
  { id: '1vnDNqb8YSuI3MogXU-wlKZAOBv-tFEPX', name: 'lavender_room_geometric_lighting', room: 'Master Bedroom Suite & Geometric Lighting' },
  { id: '1patdcAnQh0UwcJ_wt62N0qV6EweCVsfC', name: 'lavender_wall_sleek_wardrobe', room: 'Master Bedroom Built-In Wardrobes' },
  { id: '1OTs-jGyP6HveI-fx0GWpLGPV27bfHyo2', name: 'minimalist_greige_wardrobe', room: 'Minimalist Greige Full-Height Wardrobes' },
  { id: '1DIX4gUAcVyXXvXrvdcWU6oE3t3D5Tq0U', name: 'modern_minimalist_room_storage', room: 'Kids / Guest Bedroom & Study Storage' }
];

async function downloadDriveImage(id) {
  const url = `https://lh3.googleusercontent.com/d/${id}`;
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });
  const mimeType = response.headers['content-type'] || 'image/png';
  const base64 = `data:${mimeType};base64,${Buffer.from(response.data).toString('base64')}`;
  return base64;
}

async function main() {
  console.log('Starting upload of The Restful Home images to Cloudinary...');
  const uploadedMap = [];

  for (const item of DRIVE_IMAGES) {
    try {
      console.log(`Downloading ${item.name} (${item.id})...`);
      const base64 = await downloadDriveImage(item.id);
      console.log(`Uploading ${item.name} to Cloudinary...`);
      const uploadRes = await uploadToCloudinary(base64, `tellapur_restful_home_${item.name}`);
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

  const heroUrl = uploadedMap[0].url; // modern_living_space_walnut_partition
  const galleryUrls = uploadedMap.map(x => x.url);

  console.log('\n--- UPLOAD SUMMARY ---');
  console.log(`Total images uploaded: ${uploadedMap.length}`);
  console.log(`Hero image: ${heroUrl}`);

  const projectId = 'proj_10_the_restful_home_tellapur';
  const projectSlug = 'the-restful-home-tellapur';
  const projectTitle = 'The Restful Home, Tellapur';
  const category = 'Residential';
  const area = '1,250 sq.ft.';
  const location = 'Tellapur, Hyderabad';
  const year = 2026;
  const style = 'Japandi-inspired, light and functional';
  const description = 'A bright, serene 2BHK that feels more spacious than it is, and a home that welcomes the family back at the end of every day. Delivered turnkey with soft warm tones, custom slatted partitions, and smart full-height storage.';

  const story = {
    vision: "After a long day at work, this young family wanted to come home and finally exhale. They asked for a simple, peaceful home with enough storage that nothing ever feels crowded, and a layout that can grow with their children.",
    challenges: "In a compact 2BHK layout, every inch matters. The challenge was ensuring every wall quietly carries its share of storage while keeping the rooms open, light, and uncluttered, preventing any feeling of confinement.",
    solutions: "We designed around one feeling: the moment they walk in, the day should slow down. Everything was planned together. An uncluttered entrance tucked everyday items neatly away. A slatted partition separates the dining area while maintaining continuous airflow and light. Both bedrooms feature full-height custom wardrobes.",
    engineering: "Doors close softly with premium German soft-close mechanisms, finishes are curated to withstand daily family life with ease, and every bespoke millwork piece was dry-fitted precisely before final installation. Soft, warm lighting circuits were planned to take over in the evening to settle the atmosphere.",
    outcome: "A bright, serene 2BHK that feels more spacious than it is, and a home that welcomes the family back at the end of every day. Delivered turnkey and handed over exactly on the committed date."
  };

  const testimonial = {
    name: 'Dinesh & Sarvani',
    role: 'Homeowners, Tellapur',
    text: "We wanted a small home that didn't feel small, and Espacio delivered. Every inch is used well and nothing looks crowded. The team kept us informed at every stage and finished right on schedule.",
    rating: 5,
    profession: 'Homeowners, Tellapur'
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
    order: 10,
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
    10,
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
