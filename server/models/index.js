import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
let connectionString;
const env = process.env.NODE_ENV;

if (env === 'production') {
  connectionString = process.env.DATABASE_URL;
} else if (env === 'test') {
  connectionString = process.env.DATABASE_URL_TEST;
} else {
  connectionString = process.env.DATABASE_URL_DEV;
}

const db = new Pool({
  connectionString,
});

export default db;
