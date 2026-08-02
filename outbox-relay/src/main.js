const { createClient } = require('redis');
const pool = require('./db/client');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
    console.error('Redis client error', err);
});

async function main() {
    await redisClient.connect();
    console.log('Connected to redis');

    await pool.query('SELECT 1');
    console.log('Connected to postgres');
}

main().catch((err) => {
    console.error('Failed to start outbox-relay', err);
    process.exit(1);
});