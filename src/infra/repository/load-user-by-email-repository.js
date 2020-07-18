const { MissingParameterError } = require("../../utils/errors");

module.exports = class LoadUserByEmailRepository {
    constructor(userModel){
        this.userModel = userModel;
    }

    async load(email){
        if(!email){
            throw new MissingParameterError('email');
        }
        const user = await this.userModel.findOne({ email }, {
            projection: {
                password: 1
            }
        });
        return user;
    }
}