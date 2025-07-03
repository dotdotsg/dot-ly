const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


// new Pool({
//   host:  process.env.DB_HOST || 'localhost',
//   database: 'dotlydb',
//   user: 'postgres',
//   password: 'postgres',
//   port: 5432
// });

module.exports = pool;
