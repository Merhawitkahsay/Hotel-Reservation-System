import { query } from '../src/config/database.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // 1. Create roles if they don't exist
    console.log('Creating roles...');
    await query(`
      INSERT INTO roles (role_name, permissions) 
      VALUES 
        ('admin', ARRAY['*']),
        ('receptionist', ARRAY['manage_guests','manage_reservations','process_payments','view_reports']),
        ('guest', ARRAY['view_own_profile','make_reservations','view_own_reservations'])
      ON CONFLICT (role_name) DO NOTHING;
    `);

    // 2. Create admin user
    console.log('Creating admin user...');
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('Admin123', salt);
    
    await query(
      `INSERT INTO users (role_id, email, password_hash, is_active) 
       VALUES (1, $1, $2, true)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@hotel.com', adminHash]
    );

    // 3. Create receptionist user
    console.log('Creating receptionist user...');
    const receptionHash = await bcrypt.hash('Reception123', salt);
    
    await query(
      `INSERT INTO users (role_id, email, password_hash, is_active) 
       VALUES (2, $1, $2, true)
       ON CONFLICT (email) DO NOTHING`,
      ['reception@hotel.com', receptionHash]
    );

    // 4. Create sample guest user
    console.log('Creating sample guest...');
    const guestHash = await bcrypt.hash('Guest123', salt);
    
    await query(
      `INSERT INTO users (role_id, email, password_hash, is_active) 
       VALUES (3, $1, $2, true)
       ON CONFLICT (email) DO NOTHING`,
      ['guest@hotel.com', guestHash]
    );

    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
}

seedDatabase();