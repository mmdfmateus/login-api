const request = require('supertest');
const app = require('../config/app');
const bcrypt = require('bcrypt');
const MongoHelper = require('../../infra/helpers/mongo-helper');
let userModel;

describe('Login Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
        userModel = await MongoHelper.getCollection('users');
      });
  
      beforeEach(async () => {
          await userModel.deleteMany();
      });
    
      afterAll(async () => {
        await MongoHelper.disconnect();
      });

    test('Should return 200 when valid credentials are provided', async () => {
        const userInsertionOp = await userModel.insertOne({
            email: 'valid_email@mail.com',
            password: bcrypt.hashSync('password', 10)
        });
        await request(app)
            .post('/api/login')
            .send({
                email: 'valid_email@mail.com',
                password: 'password'
            })
            .expect(200);
    });
});