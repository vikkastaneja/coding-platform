const express = require('express');
const { router: problemsRouter } = require('./routes/problems')
const pool = require('./db/client');

const app = express();

app.use('/api/problems', problemsRouter);

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({status: 'ok'});
    } catch(err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
})

module.exports = app