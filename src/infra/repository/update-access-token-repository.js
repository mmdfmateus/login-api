const { MissingParameterError } = require('../../utils/errors');

module.exports = class UpdateAccessTokenRepository{
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