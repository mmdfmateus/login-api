const validator = require('validator');
const { MissingParameterError } = require('./errors');

module.exports = class EmailValidator {
    isValid(email) {
        if(!email){
            throw new MissingParameterError('email');
        }
        return validator.isEmail(email);
    }
}