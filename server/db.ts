import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function createConnection(retries = MAX_RETRIES): Promise<Pool> {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    await pool.connect(); // Ensure connection is established before returning
    return pool;
  } catch (error) {
    if (retries > 0) {
      console.log(`Database connection failed, retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return createConnection(retries - 1);
    }
    console.error("Failed to connect to the database after multiple retries:", error);
    throw error;
  }
}


export const pool = await createConnection();
export const db = drizzle({ client: pool, schema });