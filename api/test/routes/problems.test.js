const pool = require('../../src/db/client');
const { getProblems, getProblemById } = require('../../src/routes/problems');

jest.mock('../../src/db/client', () => ({
    query: jest.fn(),
}));

describe('Problems route handlers', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = { query: {}, params: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        }
    });

    describe('getProblems', () => {
        it('should return paginated problems with defaults', async () => {
            const mockRows = [{ id: 1, title: 'Two Sum', difficulty: 'Easy', solved: true }];
            pool.query.mockResolvedValueOnce({ rows: mockRows });

            await getProblems(req, res);

            // Verify pagination calculation defaults (limit=10, offset=0)
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [10, 0]);
            expect(res.json).toHaveBeenCalledWith(mockRows);
        });

        it('should calculate offset correctly when custom page and limit are provided', async () => {
            req.query = { page: '3', limit: '5' };
            pool.query.mockResolvedValueOnce({ rows: [] });

            await getProblems(req, res);

            // page 3 with limit 5 -> offset = (3 - 1) * 5 = 10
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [5, 10]);
        });

        it('should return an empty array when there are no problems', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            await getProblems(req, res);

            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    describe('getProblemById', () => {
        it('should return a 404 error if problem does not exist', async () => {
            req.params.id = '999';
            pool.query.mockResolvedValueOnce({ rows: [] });

            await getProblemById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Problem not found' });
        });

        it('should return problem details if found', async () => {
            const mockProblem = { id: 1, title: 'Two Sum' };
            req.params.id = '1';
            pool.query.mockResolvedValueOnce({ rows: [mockProblem] });

            await getProblemById(req, res);

            expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['1']);
            expect(res.json).toHaveBeenCalledWith(mockProblem);
        });
    });
});