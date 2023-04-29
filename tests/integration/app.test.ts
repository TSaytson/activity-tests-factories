import app from 'app';
import supertest from 'supertest';

const api = supertest(app);

describe(`GET /health`, () => {
    it(`should return 200`, async () => {
        const response = await api.get('/health');
        expect(response.status).toBe(200);
    })
})