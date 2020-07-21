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

        const db = await MongoHelper.getDb();
        await db.collection('users').updateOne({
            _id: userId
        }, {
            $set: {
                accessToken: accessToken
            }
        });
    }
}