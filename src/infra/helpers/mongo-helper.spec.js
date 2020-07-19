const MongoHelper = require('./mongo-helper');

describe('Mongo Helper', () => {
    test('Should reconnect when calls getdb() and the client is disconnected', async () => {
        const sut = MongoHelper;
        await sut.connect(process.env.MONGO_URL);
        expect(sut.db).toBeTruthy();
        
        await sut.disconnect();
        expect(sut.db).toBeFalsy();

        const db = await sut.getDb();
        expect(db).toEqual(sut.db);
    });
});