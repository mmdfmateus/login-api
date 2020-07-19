const MongoHelper = require('../helpers/mongo-helper');
const { MissingParameterError } = require('../../utils/errors');
let db;

class UpdateAccessTokenRepository{
    constructor(userModel){
        this.userModel = userModel;
    }

    async update(userId, accessToken){
        if(!userId){
            throw new MissingParameterError('userId');
        }
        if(!accessToken){
            throw new MissingParameterError('accessToken');
        }

        await this.userModel.updateOne({
            _id: userId
        }, {
            $set: {
                accessToken: accessToken
            }
        });
    }
}

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
        await db.collection('users').deleteMany();
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    test('Should update the user with the access token provided', async () => {
        const { sut, userModel } = makeSut();
        const userInsertionOp = await userModel.insertOne({
            email: 'valid_email@mail.com',
            name: 'name',
            age: 25,
            state: 'state',
            password: 'hashedPassword'
        });

        await sut.update(userInsertionOp.ops[0]._id, 'accessToken');
        const userUpdated = await userModel.findOne({ _id: userInsertionOp.ops[0]._id });

        expect(userUpdated.accessToken).toBe('accessToken');
    });

    test('Should throw if no userModel is provided', async () => {
        const sut = new UpdateAccessTokenRepository();
        const userModel = db.collection('users');
        const userInsertionOp = await userModel.insertOne({
            email: 'valid_email@mail.com',
            name: 'name',
            age: 25,
            state: 'state',
            password: 'hashedPassword'
        });

        const promise = sut.update(userInsertionOp.ops[0]._id, 'accessToken');

        await expect(promise).rejects.toThrow();
    });

    test('Should throw if no params are provided', async () => {
        const { sut, userModel } = makeSut();
        const userInsertionOp = await userModel.insertOne({
            email: 'valid_email@mail.com',
            name: 'name',
            age: 25,
            state: 'state',
            password: 'hashedPassword'
        });

        await expect(sut.update()).rejects.toThrow(new MissingParameterError('userId'));
        await expect(sut.update(userInsertionOp.ops[0]._id)).rejects.toThrow(new MissingParameterError('accessToken'));
    });
});