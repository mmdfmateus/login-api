const MongoHelper = require('../helpers/mongo-helper');
const { MissingParameterError } = require('../../utils/errors');
const UpdateAccessTokenRepository = require('./update-access-token-repository');
let db, userInsertedId;

const makeSut = () => {
    const userModel = db.collection('users');
    const sut = new UpdateAccessTokenRepository(userModel);

    return {
        sut,
        userModel
    };
}

describe('UpdateAccessToken Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
        db = await MongoHelper.getDb();
    });

    beforeEach(async () => {
        const userModel = db.collection('users');
        await userModel.deleteMany();
        const userInsertionOp = await userModel.insertOne({
            email: 'valid_email@mail.com',
            name: 'name',
            age: 25,
            state: 'state',
            password: 'hashedPassword'
        });
        userInsertedId = userInsertionOp.ops[0]._id;
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    test('Should update the user with the access token provided', async () => {
        const { sut, userModel } = makeSut();

        await sut.update(userInsertedId, 'accessToken');
        const userUpdated = await userModel.findOne({ _id: userInsertedId });

        expect(userUpdated.accessToken).toBe('accessToken');
    });

    test('Should throw if no userModel is provided', async () => {
        const sut = new UpdateAccessTokenRepository();

        const promise = sut.update(userInsertedId, 'accessToken');

        await expect(promise).rejects.toThrow();
    });

    test('Should throw if no params are provided', async () => {
        const { sut } = makeSut();

        await expect(sut.update()).rejects.toThrow(new MissingParameterError('userId'));
        await expect(sut.update(userInsertedId)).rejects.toThrow(new MissingParameterError('accessToken'));
    });
});