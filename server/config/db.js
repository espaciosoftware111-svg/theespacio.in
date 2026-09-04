import { query } from './supabase.js';
import User from '../models/User.js';

const connectDB = async () => {
  try {
    const res = await query("SELECT NOW() as current_time, current_database() as db_name");
    console.log(`✓ Supabase PostgreSQL connected successfully to '${res.rows[0].db_name}' at ${res.rows[0].current_time}`);
    
    // Auto-verify default administrator in Supabase
    const adminEmail = 'tarunuttupulusu@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log(`Seeding default administrator account in Supabase: ${adminEmail}`);
      await User.create({
        email: adminEmail,
        password: 'tarun2314638',
        name: 'Tarun (Super Admin)',
        role: 'superadmin',
        mustChangePassword: false,
        status: 'active',
      });
      console.log('Default administrator created in Supabase.');
    } else {
      console.log(`✓ Default administrator (${adminEmail}) verified in Supabase.`);
    }
  } catch (err) {
    console.error('Supabase DB connection error:', err.message);
  }
};

export default connectDB;
