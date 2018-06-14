const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();


const connectionString = process.env.DATABASE_URL || 'postgres://postgres:asdflkj@localhost:5432/maintenanceTrackerDb';

const pool = new Pool({
  connectionString: connectionString,
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
DROP TYPE category_type;
DROP TYPE urgency_level_type;
DROP TYPE status_type;
CREATE TYPE category_type AS ENUM ('Repair', 'Maintenance');
CREATE TYPE urgency_level_type AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE status_type AS ENUM ('Pending', 'Approved', 'Disapproved', 'In Progress', 'Resolved');
CREATE TABLE requests(
  id SERIAL PRIMARY KEY,
  userId int,
  title VARCHAR(40) not null,
  category category_type,
  UrgencyLevel urgency_level_type,
  description TEXT not null,
  status status_type,
  created_at timestamp (0) without time zone default now(),
  FOREIGN KEY (userId) REFERENCES users(id)
   )`;

// const seedRequests = `
// INSERT INTO requests VALUES( default, default, 'Laptop Issues', 'Repair', 'High', 'Description of the problem', 'Approved', default )`;

pool.query(users).then((res, err) => {
  console.log(res, err);
  error: err.message
});

pool.query(seedUsers).then((res, err) => {
  console.log(res, err);
  error: err.message
});

pool.query(requests).then((res, err) => {
  console.log(res, err);
  error: err.message
});

// pool.query(seedRequests).then((res, err) => {
//   console.log(res, err);
//   error: err.message
// });