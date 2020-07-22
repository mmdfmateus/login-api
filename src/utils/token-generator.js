const jwt = require('jsonwebtoken');
const { MissingParameterError } = require('./errors');

module.exports = class TokenGenerator {
    constructor(secret){
        this.secret = secret;
    }

    async generate(id){
        if(!this.secret){
            throw new MissingParameterError('secret');
        }
        if(!id){
            throw new MissingParameterError('id');
        }
        return jwt.sign({ _id: id }, this.secret);
    }
}