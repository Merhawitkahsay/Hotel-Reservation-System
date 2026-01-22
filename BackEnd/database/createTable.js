import pool from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupDatabase = async () => {
  try {
    console.log('--- Starting Database Setup ---');

    // Read the schema.sql file
    // Assumes schema.sql is in the root of your backend folder
    const schemaPath = path.join(__dirname, '../../schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    // We use a single client to ensure all commands run in order
    const client = await pool.connect();
    
    try {
      console.log('Executing Schema...');
      await client.query(schema);
      console.log('All tables, types, and triggers created successfully.');
      
      // Verify Users Table
      const res = await client.query("SELECT count(*) FROM roles");
      console.log(`Initial roles count: ${res.rows[0].count}`);

    } finally {
      client.release();
    }

    process.exit(0);
  } catch (err) {
    console.error('Database Setup Failed:');
    console.error(err.message);
    process.exit(1);
  }
};

setupDatabase();