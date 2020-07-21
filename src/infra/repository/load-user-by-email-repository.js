const { MissingParameterError } = require("../../utils/errors");
const MongoHelper = require('../../infra/helpers/mongo-helper');

module.exports = class LoadUserByEmailRepository {
    async load(email){
        if(!email){
            throw new MissingParameterError('email');
        }

        const userModel = await MongoHelper.getCollection('users');
        const user = await userModel.findOne({ email }, {
            projection: {
                password: 1
            }
        });
        return user;
    }
}