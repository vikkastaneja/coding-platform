const express = require('express');
const pool = require('../db/client');

const router = express.Router();

const getProblems = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT p.id, p.title, p.difficulty,
            EXISTS (
                SELECT  1 FROM submissions s
                WHERE s.problem_id = p.id AND s.status = 'PASSED'
            ) AS solved
        FROM problems p
        ORDER BY p.id
        LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    res.json(result.rows);
};

const getProblemById = async (req, res) => {
    const result = await pool.query(
        `SELECT id, title, difficulty, description, task,
            method_signature, sample_cases_json
        FROM problems
        WHERE id = $1`,
        [req.params.id]
    );

    if (result.rows.length == 0) {
        return res.status(404).json({error: 'Problem not found'});
    }

    res.json(result.rows[0]);
};

router.get('/', getProblems);

router.get('/:id', getProblemById);

module.exports = {
    router,
    getProblemById,
    getProblems
}