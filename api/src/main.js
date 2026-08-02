const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('./db/client');

const app = express();
const PORT = process.env.PORT || '3000';

async function applySchema() {
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('Schema applied');
};

app.get('/health', async(req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({status: 'ok'});
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

applySchema()
    .then(() => {
        app.listen(PORT, () => {
            console.log('api listening on port ', PORT);
        });
    })
    .catch((err) => {
        console.error('Failed to apply schema, exiting', err);
        process.exit(1);
    });