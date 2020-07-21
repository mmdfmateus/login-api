const sut = require('./mongo-helper');

describe('Mongo Helper', () => {
    beforeAll(async () => {
        await sut.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await sut.disconnect();
    });

    test('Should reconnect when calls getCollection() and the client is disconnected', async () => {
        expect(sut.db).toBeTruthy();
        
        await sut.disconnect();
        expect(sut.db).toBeFalsy();

        const userModel = await sut.getCollection('users');
        expect(userModel).toBeTruthy();
    });
});