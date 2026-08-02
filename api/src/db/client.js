const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER || 'admin',
    password: process.env.PGPASSWORD || 'admin',
    database: process.env.PGDATABASE || 'coding_platform'
});

pool.on('error', (err) => {
    console.error('Unexpected postgres pool error', err);
});

module.exports = pool;