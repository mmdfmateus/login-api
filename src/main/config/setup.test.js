const request = require('supertest');
const app = require('./app');

describe('App Setup', () => {
    test('Should X-Powered-By header', async () => {
        app.get('/test/x_powered_by', (req, res) => {
            res.send('');
        })
        
        const res = await request(app).get('/test/x_powered_by');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });

    test('Should enable CORS', async () => {
        app.get('/test/cors', (req, res) => {
            res.send('');
        })
        
        const res = await request(app).get('/test/cors');
        expect(res.headers['access-control-allow-origin']).toBe('*');
        expect(res.headers['access-control-allow-methods']).toBe('*');
        expect(res.headers['access-control-allow-headers']).toBe('*');
    });
});