const { MissingParameterError } = require('../../utils/errors');
const MongoHelper = require('../helpers/mongo-helper');

module.exports = class UpdateAccessTokenRepository{
    async update(userId, accessToken){
        if(!userId){
            throw new MissingParameterError('userId');
        }
        if(!accessToken){
            throw new MissingParameterError('accessToken');
        }

        const userModel = await MongoHelper.getCollection('users');
        await userModel.updateOne({
            _id: userId
        }, {
            $set: {
                accessToken: accessToken
            }
        });
    }
}