import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';
import * as schema from "../shared/schema";

const { Pool } = pkg;

// Setup the database connection using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a drizzle client with our schema
export const db = drizzle(pool, { schema });