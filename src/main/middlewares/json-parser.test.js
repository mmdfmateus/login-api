const request = require('supertest');
const app = require('../config/app');

describe('JSON Parser Middleware', () => {
    test('Should parse body as JSON', async () => {
        app.post('/test/json_parser', (req, res) => {
            res.send(req.body);
        });
        
        await request(app).post('/test/json_parser')
            .send({ name: 'John' })
            .expect({ name: 'John' });
    });
});