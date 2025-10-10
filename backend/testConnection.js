import db from './config/db.js';

async function checkConnection() {
  try {
    // Run a simple query to get the current time from the database
    const result = await db.query('SELECT NOW()');
    console.log('✅ Success! Connected to PostgreSQL.');
    console.log('Database time:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Error! Could not connect to the database.');
    console.error(error.message);
  }
}

checkConnection();