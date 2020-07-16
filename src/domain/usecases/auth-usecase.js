const { MissingParameterError } = require('../../utils/errors');

module.exports = class AuthUseCase {
    constructor(loadUserByEmailRepository){
        this.loadUserByEmailRepository = loadUserByEmailRepository;
    }

    async auth(email, password) {
        if(!email) {
            throw new MissingParameterError('email');
        }

        if(!password) {
            throw new MissingParameterError('password');
        }

        const user = await this.loadUserByEmailRepository.load(email);
        if(!user){
            return null;
        }
    }
}