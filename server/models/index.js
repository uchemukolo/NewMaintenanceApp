import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:asdflkj@localhost:5432/maintenanceTrackerDb',
});

export default db;