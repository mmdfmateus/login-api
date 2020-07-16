const { MissingParameterError } = require('../../utils/errors');

module.exports = class AuthUseCase {
    constructor(loadUserByEmailRepository, encrypter){
        this.loadUserByEmailRepository = loadUserByEmailRepository;
        this.encrypter = encrypter;
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

        await this.encrypter.compare(password, user.password);
        return null;
    }
}