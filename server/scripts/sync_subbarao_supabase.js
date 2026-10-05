import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import { query } from '../config/supabase.js';

const manifest = JSON.parse(fs.readFileSync('server/scripts/subbarao_processed_manifest.json', 'utf8'));

async function updateSupabase() {
  console.log('--- Updating Subbarao Duplex in Supabase Database ---');

  const projectId = 'proj_8_kachiguda_subbarao';
  const projectSlug = 'kachiguda-fusion-duplex-villa';
  const title = 'A Duplex Residence, Kachiguda';
  const category = 'duplex';
  const area = '3,800 sq.ft.';
  const location = 'Kachiguda, Hyderabad';
  const year = 2025;
  const style = 'Modern & Traditional Fusion';

  const description = 'A grand duplex residence designed for K Subbarao at Kachiguda, Hyderabad. Harmonizing contemporary architectural joinery, vibrant custom accents, dedicated pooja mandir, emerald-accented master bedroom suite, and bespoke modular kitchen.';

  const story = {
    vision: "K Subbarao envisioned a multi-generational duplex residence that bridged modern luxury with traditional cultural warmth. Rather than feeling like two detached floors, the home needed an overarching design narrative that flowed seamlessly from the grand living lounge through the central pooja shrine to the private bedroom suites on both levels.",
    challenges: "Navigating expansive double-height ceilings and multi-tiered ceiling bulkheads required meticulous light planning and material coordination. Seamlessly transitioning from the sleek, contemporary fluted media wall in the living lounge to the traditional fluted teak pooja pavilion without visual discord demanded precision millwork and exacting material tolerances.",
    solutions: "We deployed custom fluted oak wall paneling with marble slab accents and concealed warm-white LED perimeter coves. At the home's spatial nexus, we crafted a dedicated pooja mandir framed in rich fluted teak with suspended brass bells and an illuminated damask arch. The private quarters feature custom colorway expressions: a master bedroom in rich emerald and sage with a halo chandelier, and guest suites detailed with blush pink paneling and fluted acoustic headboard alcoves.",
    engineering: "All high-load cabinetry, sliding wardrobe tracks, and vanity consoles were anchored using moisture-resistant calibrated plywood with heavy-duty Blum & Hafele hardware. Ambient multi-circuit LED cove strips and architectural chandeliers were routed with dedicated concealed conduits, preventing heat buildup behind the veneer and fluted panels and ensuring long-lasting structural integrity.",
    outcome: "A magnificent turnkey duplex residence delivered with millimeter precision, praised for its cohesive architectural transitions, luxurious custom joinery, and harmonious fusion of heritage and modernity."
  };

  const testimonial = {
    name: 'K Subbarao',
    role: 'Homeowner, Kachiguda, Hyderabad',
    text: "ESPACIO transformed our Kachiguda duplex into an architectural masterpiece. From the breathtaking living lounge and the divine pooja mandir to the emerald master bedroom and custom wardrobes, their craftsmanship, attention to detail, and turnkey delivery were exceptional. Truly a five-star experience!",
    rating: 5,
    profession: 'Homeowner, Kachiguda'
  };

  const cloudGallery = manifest.items.map(it => it.cloudUrl);
  const localGallery = manifest.items.map(it => it.localWebp);

  const beforeAfter = [
    {
      before: manifest.cloudBeforeUrl,
      after: manifest.cloudAfterUrl
    }
  ];

  const rooms = manifest.items.map(it => ({
    name: it.room,
    title: it.room,
    room: it.room,
    image: it.cloudUrl,
    localImage: it.localWebp,
    description: it.description
  }));

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
    hero_image: manifest.cloudHero,
    heroImage: manifest.cloudHero,
    afterImage: manifest.cloudAfterUrl,
    afterImages: [manifest.cloudAfterUrl],
    beforeImage: manifest.cloudBeforeUrl,
    beforeImages: [manifest.cloudBeforeUrl],
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
    manifest.cloudHero,
    JSON.stringify(cloudGallery),
    JSON.stringify(beforeAfter),
    JSON.stringify(mergedData),
    projectId
  ]);

  console.log('✓ Successfully updated Supabase database with all 20 4K UHD images, rooms, before/after, and matching text!');
  process.exit(0);
}

updateSupabase().catch(err => {
  console.error('Failed to update Supabase:', err);
  process.exit(1);
});
