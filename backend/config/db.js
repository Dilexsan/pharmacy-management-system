import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const { Pool } = pg;

// Create a new "Pool" of connections.
// This is more efficient than creating a new connection for every query.
const pool = new Pool({
  // The connection string is read from your .env file
  connectionString: process.env.DATABASE_URL,
});

// We export a single method that allows us to run queries.
export default {
  query: (text, params) => pool.query(text, params),
};