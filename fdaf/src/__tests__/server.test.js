const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
  it('responds with json', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Welcome to this new Express.js Project');
  });
});