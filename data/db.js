const { Pool } = require('pg');

const pool = new Pool({
  host:  process.env.DB_HOST || 'localhost',
  database: 'dotlydb',
  user: 'postgres',
  password: 'postgres',
  port: 5432
});

module.exports = pool;
