const MongoHelper = require('../helpers/mongo-helper');
const LoadUserByEmailRepository = require('./load-user-by-email-repository');
const { MissingParameterError } = require('../../utils/errors');
let db;

const makeSut = () => {
    const userModel = db.collection('users');
    const sut = new LoadUserByEmailRepository(userModel);

    return { 
        sut,
        userModel
    };
}

describe('LoadUserByEmail Repository', () => {
  
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

    test('Should return null if no user is found', async () => {
        const { sut } = makeSut();

        const user = await sut.load('invalid_email@mail.com');

        expect(user).toBeNull();
    });

    test('Should return an user if user is found', async () => {
        const { sut, userModel } = makeSut();
        const userInsertionOp = await userModel.insertOne({
            email: 'valid_email@mail.com',
            name: 'name',
            age: 25,
            state: 'state',
            password: 'hashedPassword'
        });

        const user = await sut.load('valid_email@mail.com');

        expect(user).toEqual({
            _id: userInsertionOp.ops[0]._id,
            password: userInsertionOp.ops[0].password
        });
    });

    test('Should throw if no userModel is provided', async () => {
        const sut = new LoadUserByEmailRepository();

        const promise = sut.load('any_email@mail.com');

        await expect(promise).rejects.toThrow();
    });

    test('Should throw if no email is provided', async () => {
        const { sut } = makeSut();

        const promise = sut.load();

        await expect(promise).rejects.toThrow(new MissingParameterError('email'));
    });
});