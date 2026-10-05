import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import { query } from '../config/supabase.js';

const manifest = JSON.parse(fs.readFileSync('server/scripts/subbarao_processed_manifest.json', 'utf8'));

async function updateSupabase() {
  console.log('--- Updating Subbarao Duplex in Supabase Database (26 4K images) ---');

  const projectId = 'proj_8_kachiguda_subbarao';
  const projectSlug = 'kachiguda-fusion-duplex-villa';
  const title = 'A Duplex Residence, Kachiguda';
  const category = 'duplex';
  const area = '3,800 sq.ft.';
  const location = 'Kachiguda, Hyderabad';
  const year = 2025;
  const style = 'Modern & Desi 4BHK Fusion';

  const description = "An exquisite fusion of contemporary luxury and Desi soul across a sprawling 4BHK duplex in Kachiguda, Hyderabad. Featuring a grand living hall with a floating linear fireplace and sculptural marble staircase, an open-concept dining pavilion with smart integrated appliances, a bespoke modular chef's kitchen, a serene parents' suite with traditional circular ink art and walk-in dressing lounge, and an aviation-themed boys' bedroom with a custom vintage aeronautical biplane blueprint mural.";

  const story = {
    vision: "To craft a multi-generational 4BHK duplex residence in Kachiguda where modern European minimalist aesthetics coalesce with Indian domestic warmth. The design centers around an expansive ground-floor living and entertainment zone, interconnected by a sweeping marble staircase with glass balustrades, creating seamless sightlines between the lounge, dining island, and culinary spaces.",
    challenges: "Unifying the open-concept ground floor without acoustic reverberation between the entertainment lounge and culinary zones, while crafting deeply tailored atmospheres for each generation: an elegant, serene retreat for the parents with heritage 'Desi' artwork and rich walnut joinery, and an aspirational bedroom for the boys featuring authentic vintage technical illustrations.",
    solutions: "Engineered acoustic fluted wall paneling, perimeter architectural coves, and recessed magnetic track lighting to softly define functional zones. Anchored the living hall with a floating media wall, roaring linear fireplace, and sculptural staircase. Commissioned a custom full-scale vintage French Nieuport biplane technical blueprint mural in the boys' suite, and designed a tranquil parents' sanctuary with solid walnut furniture, traditional circular ink mandala art, and a fluted walk-in dressing wardrobe.",
    outcome: "A tour-de-force of turnkey residential architecture. Flawless zero-tolerance millwork, imported Calacatta marble accents, integrated smart refrigeration, and bespoke lighting fixtures coalesce into an opulent, warm home delivered on schedule for K. Subba Rao and family.",
    engineering: "Precision-engineered carpentry with PU and champagne gloss finishes, custom glass-and-brass stair balustrades, concealed ducted HVAC raceways, and smart digital integration across modular kitchen and wardrobe systems."
  };

  const testimonial = {
    name: 'K. Subba Rao',
    role: 'Homeowner, Kachiguda, Hyderabad',
    text: "ESPACIO brought our vision of a modern yet deeply comfortable 4BHK duplex to life. From the breathtaking ground-floor living hall with its linear fireplace and marble staircase to the aviation blueprint bedroom our sons adore and our own peaceful parents suite, every inch is engineered with supreme craftsmanship. The turnkey execution was flawless!",
    rating: 5,
    profession: 'Homeowner, Kachiguda'
  };

  const cloudGallery = manifest.images;
  const localGallery = manifest.localImages;

  const beforeAfter = [
    {
      before: manifest.beforeImage,
      after: manifest.afterImage
    }
  ];

  const rooms = manifest.rooms;

  // Fetch existing data
  const existingRes = await query("SELECT data FROM projects WHERE id = $1 OR slug = $2", [projectId, projectSlug]);
  let currentData = {};
  if (existingRes.rows.length > 0 && existingRes.rows[0].data) {
    currentData = typeof existingRes.rows[0].data === 'string' ? JSON.parse(existingRes.rows[0].data) : existingRes.rows[0].data;
  }

  const mergedData = {
    ...currentData,
    _id: projectId,
    id: projectId,
    title,
    slug: projectSlug,
    category,
    area,
    location,
    year,
    style,
    description,
    story,
    testimonial,
    testimonialName: testimonial.name,
    testimonialText: testimonial.text,
    testimonialRating: testimonial.rating,
    testimonialProfession: testimonial.profession,
    hero_image: manifest.heroImage,
    heroImage: manifest.heroImage,
    afterImage: manifest.afterImage,
    afterImages: [manifest.afterImage],
    beforeImage: manifest.beforeImage,
    beforeImages: [manifest.beforeImage],
    gallery: cloudGallery,
    galleryImages: cloudGallery,
    gallery_images: cloudGallery,
    local_gallery: localGallery,
    before_after: beforeAfter,
    rooms,
    featured: true,
    status: 'published'
  };

  const updateRes = await query(`
    UPDATE projects SET
      title = $1,
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
      data = $13::jsonb,
      updated_at = NOW()
    WHERE id = $14 OR slug = $2
  `, [
    title,
    projectSlug,
    category,
    area,
    location,
    year,
    style,
    description,
    JSON.stringify(story),
    manifest.heroImage,
    JSON.stringify(cloudGallery),
    JSON.stringify(beforeAfter),
    JSON.stringify(mergedData),
    projectId
  ]);

  console.log(`✓ Successfully updated Supabase database with all 26 4K UHD images, rooms, before/after, and matching text! Rows updated: ${updateRes.rowCount}`);
  process.exit(0);
}

updateSupabase().catch(err => {
  console.error('Failed to update Supabase:', err);
  process.exit(1);
});
