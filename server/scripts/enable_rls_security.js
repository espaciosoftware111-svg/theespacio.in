import { pool } from '../config/supabase.js';

async function enableRLS() {
  console.log('Connecting to Supabase to enable Row Level Security (RLS)...');
  const client = await pool.connect();

  try {
    const commands = [
      // Sensitive tables: lock down completely from anon key
      `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE leads ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;`,

      // Public tables: enable RLS and add public SELECT policies
      `ALTER TABLE projects ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Public Read Projects" ON projects;`,
      `CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);`,

      `ALTER TABLE products ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Public Read Products" ON products;`,
      `CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);`,

      `ALTER TABLE categories ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Public Read Categories" ON categories;`,
      `CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);`,

      `ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Public Read FAQs" ON faqs;`,
      `CREATE POLICY "Public Read FAQs" ON faqs FOR SELECT USING (true);`,

      `ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Public Read Testimonials" ON testimonials;`,
      `CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);`,

      `ALTER TABLE settings ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Public Read Settings" ON settings;`,
      `CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);`,

      `ALTER TABLE media ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Public Read Media" ON media;`,
      `CREATE POLICY "Public Read Media" ON media FOR SELECT USING (true);`
    ];

    for (const sql of commands) {
      await client.query(sql);
      console.log(`✓ Executed: ${sql}`);
    }

    console.log('\n🎉 ROW LEVEL SECURITY (RLS) ENABLED ON ALL TABLES SUCCESSFULLY!');
  } catch (err) {
    console.error('Error enabling RLS:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

enableRLS();
