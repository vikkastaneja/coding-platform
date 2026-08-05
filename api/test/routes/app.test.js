const request = require('supertest');

jest.mock('../../src/db/client', () => ({
    query: jest.fn(),
}));

const pool = require('../../src/db/client');
const app = require('../../src/app');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('GET /health', () => {
    it('returns 200 and status ok when the database is reachable', async () => {
        pool.query.mockResolvedValueOnce({});

        const res = await request(app).get('/health');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });

    it('returns 500 and an error message when the database is unreachable', async () => {
        pool.query.mockRejectedValueOnce(new Error('connection refused'));

        const res = await request(app).get('/health');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ status: 'error', message: 'connection refused' });
    });
});

describe('problems router is mounted at /api/problems', () => {
    it('routes GET /api/problems to the problems handler', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get('/api/problems');

        expect(res.status).toBe(200);
    });

    it('routes GET /api/problems/:id to the detail handler, with the id parsed from the URL', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 42, title: 'Two Sum' }] });

        const res = await request(app).get('/api/problems/42');

        expect(res.status).toBe(200);
        expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['42']);
    });
});