const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

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
console.log('>>>>>>>>', env);
console.log('>>>>>>>', connectionString);


const pool = new Pool({
  connectionString,
});

const password = 'asdf1234';
const hashPassword = bcrypt.hashSync(password, 10);

const users = `
DROP TABLE IF EXISTS users cascade;
  CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(40) not null unique,
    firstName VARCHAR(40) not null,
    lastName VARCHAR(40) not null,
    email VARCHAR(40) not null unique,
    password VARCHAR(255) not null,
    role VARCHAR(20) default 'User',
    created_at timestamp (0) without time zone default now())`;


const seedUsers = `
INSERT INTO users VALUES( default, 'muche', 'Uche', 'Mukolo', 'muche@email.com', '${hashPassword}', 'Admin', default )`;

const requests = `
DROP TABLE IF EXISTS requests cascade;
DROP TYPE IF EXISTS category_type;
DROP TYPE IF EXISTS urgency_level_type;
DROP TYPE IF EXISTS status_type;
CREATE TYPE category_type AS ENUM ('Repair', 'Maintenance');
CREATE TYPE urgency_level_type AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE status_type AS ENUM ('Pending', 'Approved', 'Disapproved', 'Resolved');
CREATE TABLE requests(
  id SERIAL PRIMARY KEY,
  userId int,
  title VARCHAR(40) not null,
  category category_type,
  UrgencyLevel urgency_level_type,
  description TEXT not null,
  currentStatus status_type default 'Pending',
  created_at timestamp (0) without time zone default now(),
  FOREIGN KEY (userId) REFERENCES users(id)
   )`;

pool.query(users).then((res) => {
  if (res) {
    console.log('User table created');
  } else {
    console.log('Error creating users table');
  }
  pool.query(seedUsers).then((res) => {
    if (res) {
      console.log('Seeding users successful');
    } else {
      console.log('Error seeding users');
    }

    pool.query(requests).then((res) => {
      if (res) {
        console.log('Request table created');
      } else {
        console.log('Error creating Request Table');
      }
      pool.end();
    });
  });
});
