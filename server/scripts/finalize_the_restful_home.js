import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { uploadToCloudinary } from '../utils/cloudinaryHelper.js';
import { query } from '../config/supabase.js';

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
  return `data:${mimeType};base64,${Buffer.from(response.data).toString('base64')}`;
}

async function run() {
  console.log('Downloading & uploading modern_living_space_walnut_partition...');
  const base64 = await downloadDriveImage('1xexNf66fUxRqneNROuei006rqOf7NwoJ');
  const uploadRes = await uploadToCloudinary(base64, 'tellapur_restful_home_modern_living_walnut_partition');
  const livingHeroUrl = uploadRes.secure_url || uploadRes.url;
  console.log('Hero living room uploaded:', livingHeroUrl);

  // All 13 images mapped
  const allImages = [
    { url: livingHeroUrl, name: 'Living Lounge & Walnut Partition' },
    { url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039562/espacio_gallery/xivp043sbxsjdntmyeji.png', name: 'Slatted Dining Partition & Ambient Marble' },
    { url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039566/espacio_gallery/flfizkibqnyv1ktude6t.png', name: 'Open-Concept Living & Kitchen Transition' },
    { url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039570/espacio_gallery/dntcpbg0dg78vu5hktwt.png', name: 'Bright L-Shaped Modular Kitchen' },
    { url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039573/espacio_gallery/xehnw42t41tcxvtc60ml.png', name: 'Modular Kitchen Cabinetry with Warm Wood Accents' },
    { url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039583/espacio_gallery/wazorsezkcaayd5bmrc1.png', name: 'Teal & Marble Accent Galley Kitchen' },
    { url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039588/espacio_gallery/s6vvkmvqz8h2aqbtwcam.png', name: 'Warmly Lit Modern Home Shrine' },
    { url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039591/espacio_gallery/zmsezgqkrwiqdgyno9oi.png', name: 'Pooja Mandir with Glowing Om Feature' },
    { url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039594/espacio_gallery/c3z7b0m8xrq56mvdq7b4.png', name: 'Integrated Pooja Mandir & Kitchen' },
    { url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039597/espacio_gallery/gl4os8hhxhsy9vke0cx1.png', name: 'Master Bedroom Suite & Geometric Lighting' },
    { url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039600/espacio_gallery/ixrrcgxxhf1pytdjjhga.png', name: 'Master Bedroom Built-In Wardrobes' },
    { url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039616/espacio_gallery/jmbconw0wz7rrzqqaiub.png', name: 'Minimalist Greige Full-Height Wardrobes' },
    { url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039619/espacio_gallery/b9negjore9wp71j24l8t.png', name: 'Kids / Guest Bedroom & Study Storage' }
  ];

  const galleryUrls = allImages.map(img => img.url);
  const heroImage = livingHeroUrl;

  const projectId = 'proj_10_the_restful_home_tellapur';
  const projectSlug = 'the-restful-home-tellapur';
  const projectTitle = 'The Restful Home';
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
    outcome: "A bright, serene 2BHK that feels more spacious than it is, and a home that welcomes the family back at the end of every day. Delivered turnkey and handed over on the committed date."
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
      before: heroImage,
      after: heroImage
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
    hero_image: heroImage,
    heroImage: heroImage,
    afterImage: heroImage,
    afterImages: [heroImage],
    beforeImage: heroImage,
    beforeImages: [heroImage],
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

  await query(`
    UPDATE projects
    SET title = $1,
        slug = $2,
        category = $3,
        area = $4,
        location = $5,
        year = $6,
        style = $7,
        description = $8,
        story = $9::jsonb,
        hero_image = $10,
        gallery = $11::jsonb,
        before_after = $12::jsonb,
        featured = true,
        "order" = 10,
        status = 'published',
        soft_delete = false,
        data = $13::jsonb,
        updated_at = NOW()
    WHERE id = $14
  `, [
    projectTitle,
    projectSlug,
    category,
    area,
    location,
    year,
    style,
    description,
    JSON.stringify(story),
    heroImage,
    JSON.stringify(galleryUrls),
    JSON.stringify(beforeAfter),
    JSON.stringify(dataObj),
    projectId
  ]);

  console.log('Successfully updated project in Supabase with all 13 images and walnut living room hero!');
}

run().catch(console.error);
