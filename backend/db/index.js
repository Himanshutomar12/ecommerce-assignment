const { Pool } = require('pg');
require('dotenv').config();
// Configure your PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // Set this to true if you have a certificate to verify
      }
});

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL successfully!');
    // Optionally, you can execute a simple query to verify the connection further
    return pool.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Current Time:', res.rows[0]);
  })
  .catch(err => {
    console.error('Connection error', err);
  });

module.exports = {
    query: (text, params) => pool.query(text, params),
};