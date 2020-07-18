const { MongoClient } = require('mongodb');
const LoadUserByEmailRepository = require('./load-user-by-email-repository');
let connection;
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
      connection = await MongoClient.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      db = await connection.db();
    });

    beforeEach(async () => {
        await db.collection('users').deleteMany();
    });
  
    afterAll(async () => {
      await connection.close();
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
});