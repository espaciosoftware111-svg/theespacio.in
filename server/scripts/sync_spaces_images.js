import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgres://postgres.etxlhcpttnmqndiqbvqx:ESPACIO%40password@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres'
});

const SPACES_IMAGES_MAP = {
  'modular-kitchen': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790427747/hf_20260926_125254_d829d747-17df-43a6-8786-0a4d6b041695.png',
  'pooja-room': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790427772/hf_20260926_125414_74dd535c-b43d-4439-8e1d-29f1d5ce46e5.png',
  'walk-in-wardrobe': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790427788/hf_20260926_125434_bbbaef9a-ed61-4c98-9ec4-1dd081357147.png',
  'wardrobes': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790427805/hf_20260926_125507_56ae13ff-2251-4e94-baba-dc9f8b300620.png',
  'master-bedroom': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790427821/hf_20260926_125525_38864436-c886-4bc1-8e0c-1f45db24f7bb.png',
  'bar': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790427837/hf_20260926_125558_d6e03bd2-82c9-4157-8f76-54556a1ebe41.png',
  'living-room': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790427851/hf_20260926_125614_59b74a58-c260-4e7a-820c-a59241fcfcf8.png',
  'dining-room': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790427871/hf_20260926_125650_185b9f72-b95c-4152-89ad-f10a7b14ffd3.png'
};

const NEW_BEFORE_AFTER_SLIDES = [
  {
    title: 'Living Rooms',
    tag: 'Panoramic Sunken Lounge & Terrace',
    location: 'Financial District, Hyderabad',
    scope: 'Sunken Living Seating, Warm Cove Ceiling & Seamless Coastal Flow',
    before: '/images/spaces/spaces_hero_before.webp',
    after: 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790427851/hf_20260926_125614_59b74a58-c260-4e7a-820c-a59241fcfcf8.png'
  },
  {
    title: 'Modular Kitchens',
    tag: 'Precision-Engineered Chef Suite',
    location: 'Jubilee Hills, Hyderabad',
    scope: 'Handleless Matte Anthracite, Walk-In Pantry & Quartz Island',
    before: '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_0-20260810-173514.jpg',
    after: 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790427747/hf_20260926_125254_d829d747-17df-43a6-8786-0a4d6b041695.png'
  },
  {
    title: 'Master Bedrooms',
    tag: 'Serene Sanctuary Suite',
    location: 'Kokapet, Hyderabad',
    scope: 'Custom Floating Bed, Architectural Chandelier & Warm Dressing Nook',
    before: '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_0-20260810-124909.jpg',
    after: 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790427821/hf_20260926_125525_38864436-c886-4bc1-8e0c-1f45db24f7bb.png'
  },
  {
    title: 'Dining & Bars',
    tag: 'Black Marble & Gold Statement Suite',
    location: 'Banjara Hills, Hyderabad',
    scope: 'Sculptural Brass Pedestal Dining, Fluted Glass Chandelier & Velvet Seating',
    before: '/images/company/2bhk_mordern_retro/dining_2.jpg',
    after: 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790427871/hf_20260926_125650_185b9f72-b95c-4152-89ad-f10a7b14ffd3.png'
  }
];

async function syncSpaces() {
  try {
    console.log('Connecting to database...');

    // 1. Fetch current spaces_list
    const spacesRow = await pool.query("SELECT id, value FROM settings WHERE key = 'spaces_list'");
    let spacesList = [];
    if (spacesRow.rows.length > 0 && Array.isArray(spacesRow.rows[0].value)) {
      spacesList = spacesRow.rows[0].value;
    }

    // Update each category in spacesList
    for (const cat of spacesList) {
      if (SPACES_IMAGES_MAP[cat.slug]) {
        const newImg = SPACES_IMAGES_MAP[cat.slug];
        cat.heroImage = newImg;
        if (!Array.isArray(cat.galleryImages)) {
          cat.galleryImages = [newImg];
        } else {
          cat.galleryImages = [newImg, ...cat.galleryImages.filter(img => img !== newImg)];
        }
        console.log(`Updated ${cat.name} (${cat.slug}) -> ${newImg}`);
      }
    }

    // Upsert spaces_list into settings
    await pool.query(`
      INSERT INTO settings (id, key, value, updated_at)
      VALUES ('setting_spaces_list', 'spaces_list', $1::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE
      SET value = $1::jsonb, updated_at = NOW()
    `, [JSON.stringify(spacesList)]);
    console.log('Saved setting_spaces_list to database.');

    // Upsert spaces_before_after_slides into settings
    await pool.query(`
      INSERT INTO settings (id, key, value, updated_at)
      VALUES ('setting_spaces_before_after_slides', 'spaces_before_after_slides', $1::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE
      SET value = $1::jsonb, updated_at = NOW()
    `, [JSON.stringify(NEW_BEFORE_AFTER_SLIDES)]);
    console.log('Saved spaces_before_after_slides to database.');

    // Update site_settings and global_cms_settings
    const metaRows = await pool.query("SELECT id, key, value FROM settings WHERE key IN ('site_settings', 'global_cms_settings')");
    for (const row of metaRows.rows) {
      const current = row.value || {};
      current.spaces_list = spacesList;
      current.spaces_before_after_slides = NEW_BEFORE_AFTER_SLIDES;
      await pool.query("UPDATE settings SET value = $1::jsonb, updated_at = NOW() WHERE id = $2", [JSON.stringify(current), row.id]);
      console.log(`Updated composite setting ${row.key}`);
    }

    console.log('Database synchronization completed successfully!');
  } catch (err) {
    console.error('Sync error:', err);
  } finally {
    await pool.end();
  }
}

syncSpaces();
