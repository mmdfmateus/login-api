const MongoHelper = require('../helpers/mongo-helper');
let db;

class UpdateAccessTokenRepository{
    constructor(userModel){
        this.userModel = userModel;
    }

    async update(userId, accessToken){
        await this.userModel.updateOne({
            _id: userId
        }, {
            $set: {
                accessToken: accessToken
            }
        });
    }
}

describe('UpdateAccessToken Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
        db = await MongoHelper.getDb();
    });

    beforeEach(async () => {
        await db.collection('users').deleteMany();
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    test('Should update the user with the access token provided', async () => {
        const userModel = db.collection('users');
        const userInsertionOp = await userModel.insertOne({
            email: 'valid_email@mail.com',
            name: 'name',
            age: 25,
            state: 'state',
            password: 'hashedPassword'
        });
        const sut = new UpdateAccessTokenRepository(userModel);

        await sut.update(userInsertionOp.ops[0]._id, 'accessToken');
        const userUpdated = await userModel.findOne({ _id: userInsertionOp.ops[0]._id });

        expect(userUpdated.accessToken).toBe('accessToken');
    });
});