import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://etxlhcpttnmqndiqbvqx.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-pYBn5RDZzFtB2oSa6UP0w_ilVZono0';
export const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';
export const SUPABASE_JWKS_URL = process.env.SUPABASE_JWKS_URL || 'https://etxlhcpttnmqndiqbvqx.supabase.co/auth/v1/.well-known/jwks.json';

const rawDbUrl = process.env.DATABASE_URL || 
  'postgres://postgres.etxlhcpttnmqndiqbvqx:ESPACIO%40password@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

export const DATABASE_URL = rawDbUrl.replace(/[?&]sslmode=[^&]+/, '');

// Direct PostgreSQL pool via Supabase pooler
export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.warn('Supabase PostgreSQL Pool Background Warning:', err.message);
});

// Helper for executing queries with error recovery
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production' && duration > 500) {
      console.log(`Executed query in ${duration}ms: ${text.slice(0, 100)}`);
    }
    return res;
  } catch (err) {
    console.error('Database Query Error:', err.message, 'SQL:', text.slice(0, 150));
    throw err;
  }
};

// Supabase JavaScript Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export default {
  pool,
  query,
  supabase,
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  DATABASE_URL,
};
