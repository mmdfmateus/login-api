const bcrypt = require('bcrypt');
const { MissingParameterError } = require('./errors');

module.exports = class Encrypter {
    async compare(value, hashedValue){
        if(!value){
            throw new MissingParameterError('value');
        }
        if(!hashedValue){
            throw new MissingParameterError('hashedValue');
        }

        const isValid = await bcrypt.compare(value, hashedValue);
        return isValid;
    }
}