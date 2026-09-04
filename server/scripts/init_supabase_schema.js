import pg from 'pg';
import bcrypt from 'bcrypt';
import {
  DEFAULT_PROJECTS,
  DEFAULT_PRODUCTS,
  DEFAULT_FAQS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_SETTINGS,
  DEFAULT_ADMIN_USERS
} from '../../client/src/utils/cmsStore.js';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgres://postgres.etxlhcpttnmqndiqbvqx:ESPACIO%40password@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 5
});

async function initSchemaAndData() {
  console.log('Connecting to Supabase PostgreSQL at aws-0-ap-southeast-2.pooler.supabase.com...');
  const client = await pool.connect();

  try {
    console.log('1. Creating database tables...');

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        _id TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'admin',
        must_change_password BOOLEAN DEFAULT false,
        status TEXT DEFAULT 'active',
        last_login TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ Table created: users');

    // 2. Projects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        _id TEXT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT,
        area TEXT,
        location TEXT,
        year INTEGER,
        style TEXT,
        description TEXT,
        story JSONB DEFAULT '{}'::jsonb,
        hero_image TEXT,
        gallery JSONB DEFAULT '[]'::jsonb,
        before_after JSONB DEFAULT '[]'::jsonb,
        featured BOOLEAN DEFAULT false,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ Table created: projects');

    // 3. Products Table (Materials)
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        _id TEXT,
        name TEXT,
        title TEXT,
        slug TEXT UNIQUE,
        category TEXT,
        description TEXT,
        hero_image TEXT,
        image TEXT,
        images JSONB DEFAULT '[]'::jsonb,
        specifications JSONB DEFAULT '{}'::jsonb,
        features JSONB DEFAULT '[]'::jsonb,
        finishes JSONB DEFAULT '[]'::jsonb,
        tags JSONB DEFAULT '[]'::jsonb,
        price TEXT,
        unit TEXT,
        in_stock BOOLEAN DEFAULT true,
        featured BOOLEAN DEFAULT false,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ Table created: products');

    // 4. Categories Table (Spaces)
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        _id TEXT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        type TEXT,
        description TEXT,
        hero_image TEXT,
        image TEXT,
        icon TEXT,
        visible BOOLEAN DEFAULT true,
        details JSONB DEFAULT '{}'::jsonb,
        gallery_images JSONB DEFAULT '[]'::jsonb,
        filters JSONB DEFAULT '[]'::jsonb,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ Table created: categories');

    // 5. FAQs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id TEXT PRIMARY KEY,
        _id TEXT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category TEXT,
        image TEXT,
        status TEXT DEFAULT 'Published',
        home_order INTEGER DEFAULT 0,
        faq_page_order INTEGER DEFAULT 0,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ Table created: faqs');

    // 6. Testimonials Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        _id TEXT,
        name TEXT NOT NULL,
        client_name TEXT,
        role TEXT,
        project TEXT,
        rating INTEGER DEFAULT 5,
        comment TEXT,
        text TEXT,
        review TEXT,
        avatar TEXT,
        client_image TEXT,
        avatar_fallback TEXT,
        date TEXT,
        google_verified BOOLEAN DEFAULT true,
        featured BOOLEAN DEFAULT false,
        active BOOLEAN DEFAULT true,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ Table created: testimonials');

    // 7. Leads Table (Enquiries)
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        _id TEXT,
        name TEXT,
        email TEXT,
        phone TEXT,
        space_type TEXT,
        location TEXT,
        budget TEXT,
        timeline TEXT,
        message TEXT,
        notes TEXT,
        status TEXT DEFAULT 'New',
        source TEXT DEFAULT 'Website Contact Form',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ Table created: leads');

    // 8. Settings Table (Unified Global Settings)
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY DEFAULT 'global_cms_settings',
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ Table created: settings');

    // 9. Media Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        _id TEXT,
        file_name TEXT,
        original_name TEXT,
        url TEXT,
        image_url TEXT,
        storage_provider TEXT DEFAULT 'cloudinary',
        cloudinary_public_id TEXT,
        cloudinary_asset_id TEXT,
        resource_type TEXT,
        format TEXT,
        width INTEGER,
        height INTEGER,
        file_size TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ Table created: media');

    // 10. Activity Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        _id TEXT,
        user_id TEXT,
        user_name TEXT,
        user_email TEXT,
        action TEXT,
        entity TEXT,
        entity_id TEXT,
        details JSONB DEFAULT '{}'::jsonb,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ Table created: activity_logs');

    console.log('\n2. Populating Initial Data into Supabase...');

    // Seed Users
    for (const u of DEFAULT_ADMIN_USERS) {
      const id = u.id || u._id || `user_${Date.now()}`;
      let hashedPw = u.password;
      if (!hashedPw || !hashedPw.startsWith('$2b$')) {
        hashedPw = await bcrypt.hash('tarun2314638', 10);
      }
      await client.query(`
        INSERT INTO users (id, _id, email, password, name, role, status, last_login)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          status = EXCLUDED.status;
      `, [id, id, u.email.toLowerCase(), hashedPw, u.name, u.role, u.status || 'active', u.lastLogin || 'Just now']);
    }
    console.log(`  ✓ Seeded users (${DEFAULT_ADMIN_USERS.length} accounts)`);

    // Seed Projects
    let pIdx = 0;
    for (const p of DEFAULT_PROJECTS) {
      const id = p._id || p.id || `proj_${p.slug || pIdx}`;
      await client.query(`
        INSERT INTO projects (
          id, _id, title, slug, category, area, location, year, style,
          description, story, hero_image, gallery, before_after, featured, "order"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
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
          "order" = EXCLUDED."order";
      `, [
        id, id, p.title, p.slug, p.category, p.area, p.location, p.year || 2025, p.style,
        p.description, JSON.stringify(p.story || {}), p.heroImage,
        JSON.stringify(p.gallery || []), JSON.stringify(p.beforeAfter || []),
        p.featured !== false, p.order ?? pIdx
      ]);
      pIdx++;
    }
    console.log(`  ✓ Seeded projects (${DEFAULT_PROJECTS.length} projects)`);

    // Seed Products (Materials)
    let prodIdx = 0;
    for (const prod of (DEFAULT_PRODUCTS || [])) {
      const id = prod._id || prod.id || `prod_${prod.slug || prodIdx}`;
      const slug = prod.slug || `product-${prodIdx}`;
      await client.query(`
        INSERT INTO products (
          id, _id, name, title, slug, category, description, hero_image,
          image, images, specifications, features, finishes, tags, price, unit,
          in_stock, featured, "order"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          hero_image = EXCLUDED.hero_image,
          image = EXCLUDED.image,
          images = EXCLUDED.images,
          specifications = EXCLUDED.specifications,
          features = EXCLUDED.features,
          finishes = EXCLUDED.finishes,
          tags = EXCLUDED.tags,
          price = EXCLUDED.price,
          unit = EXCLUDED.unit,
          in_stock = EXCLUDED.in_stock,
          featured = EXCLUDED.featured,
          "order" = EXCLUDED."order";
      `, [
        id, id, prod.name || prod.title, prod.title || prod.name, slug,
        prod.category, prod.description, prod.heroImage || prod.image,
        prod.image || prod.heroImage, JSON.stringify(prod.images || []),
        JSON.stringify(prod.specifications || {}), JSON.stringify(prod.features || []),
        JSON.stringify(prod.finishes || []), JSON.stringify(prod.tags || []),
        prod.price || '', prod.unit || '', prod.inStock !== false,
        prod.featured === true, prod.order ?? prodIdx
      ]);
      prodIdx++;
    }
    console.log(`  ✓ Seeded products (${(DEFAULT_PRODUCTS || []).length} materials)`);

    // Seed Categories (Spaces)
    const spacesList = DEFAULT_SETTINGS.spaces_list || [];
    let catIdx = 0;
    for (const cat of spacesList) {
      const id = cat.id || cat._id || `cat_${cat.slug || catIdx}`;
      await client.query(`
        INSERT INTO categories (
          id, _id, name, slug, type, description, hero_image, image, visible,
          details, gallery_images, filters, "order"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          hero_image = EXCLUDED.hero_image,
          image = EXCLUDED.image,
          visible = EXCLUDED.visible,
          details = EXCLUDED.details,
          gallery_images = EXCLUDED.gallery_images,
          filters = EXCLUDED.filters,
          "order" = EXCLUDED."order";
      `, [
        id, id, cat.name, cat.slug, 'space', cat.description,
        cat.heroImage || cat.image, cat.image || cat.heroImage,
        cat.visible !== false, JSON.stringify(cat.details || {}),
        JSON.stringify(cat.galleryImages || []), JSON.stringify(cat.filters || []),
        cat.order ?? catIdx
      ]);
      catIdx++;
    }
    console.log(`  ✓ Seeded categories (${spacesList.length} spaces)`);

    // Seed FAQs
    let fIdx = 0;
    for (const f of DEFAULT_FAQS) {
      const id = f._id || f.id || `faq_${fIdx + 1}`;
      await client.query(`
        INSERT INTO faqs (id, _id, question, answer, category, image, status, home_order, faq_page_order, "order")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          question = EXCLUDED.question,
          answer = EXCLUDED.answer,
          category = EXCLUDED.category,
          image = EXCLUDED.image,
          status = EXCLUDED.status,
          home_order = EXCLUDED.home_order,
          faq_page_order = EXCLUDED.faq_page_order,
          "order" = EXCLUDED."order";
      `, [
        id, id, f.question || f.q, f.answer || f.a, f.category || f.tag || 'GENERAL',
        f.image || f.img || '', f.status || 'Published', f.homeOrder ?? fIdx,
        f.faqPageOrder ?? fIdx, fIdx
      ]);
      fIdx++;
    }
    console.log(`  ✓ Seeded FAQs (${DEFAULT_FAQS.length} items)`);

    // Seed Testimonials
    let tIdx = 0;
    for (const t of DEFAULT_TESTIMONIALS) {
      const id = t._id || t.id || `testi_${tIdx + 1}`;
      await client.query(`
        INSERT INTO testimonials (
          id, _id, name, client_name, role, project, rating, comment, text,
          review, avatar, client_image, date, google_verified, featured, active, "order"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          client_name = EXCLUDED.client_name,
          role = EXCLUDED.role,
          project = EXCLUDED.project,
          rating = EXCLUDED.rating,
          comment = EXCLUDED.comment,
          text = EXCLUDED.text,
          review = EXCLUDED.review,
          avatar = EXCLUDED.avatar,
          client_image = EXCLUDED.client_image,
          date = EXCLUDED.date,
          google_verified = EXCLUDED.google_verified,
          featured = EXCLUDED.featured,
          active = EXCLUDED.active,
          "order" = EXCLUDED."order";
      `, [
        id, id, t.name || t.clientName, t.clientName || t.name, t.role || '',
        t.project || '', Number(t.rating) || 5, t.comment || t.text || t.review,
        t.text || t.comment || t.review, t.review || t.comment || t.text,
        t.avatar || t.clientImage, t.clientImage || t.avatar, t.date || '2025',
        t.googleVerified !== false, t.featured === true, t.active !== false, tIdx
      ]);
      tIdx++;
    }
    console.log(`  ✓ Seeded Testimonials (${DEFAULT_TESTIMONIALS.length} reviews)`);

    // Seed Global Settings
    await client.query(`
      INSERT INTO settings (id, data)
      VALUES ('global_cms_settings', $1)
      ON CONFLICT (id) DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = NOW();
    `, [JSON.stringify(DEFAULT_SETTINGS)]);
    console.log('  ✓ Seeded Global Settings (Hero text, stats, navigation, experience centers)');

    console.log('\n🎉 ALL TABLES CREATED AND POPULATED IN SUPABASE SUCCESSFULLY!');
  } finally {
    client.release();
    await pool.end();
  }
}

initSchemaAndData().catch(err => {
  console.error('Fatal schema initialization error:', err);
  process.exit(1);
});
