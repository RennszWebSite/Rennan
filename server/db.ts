
import { neon, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../shared/schema';

const sql = neon(process.env.DATABASE_URL!);
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(sql, { schema });

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function connectWithRetry(retries = MAX_RETRIES): Promise<typeof db> {
  try {
    // Test the connection
    await sql`SELECT 1`;
    console.log('Database connected successfully');
    return db;
  } catch (error) {
    if (retries > 0) {
      console.log(`Database connection failed, retrying in ${RETRY_DELAY}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(retries - 1);
    }
    throw new Error('Failed to connect to database after multiple retries');
  }
}

export { connectWithRetry as connect };
