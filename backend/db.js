const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',      
  host: 'localhost',
  database: 'finance_db',
  password: 'Nandika2005', 
  port: 5432,
});

module.exports = pool;
