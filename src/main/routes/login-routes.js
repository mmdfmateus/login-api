const LoginRouter = require('../../presentation/routers/login-router');
const AuthUseCase = require('../../domain/usecases/auth-usecase');
const EmailValidator = require('../../utils/email-validator');
const LoadUserByEmailRepository = require('../../infra/repository/load-user-by-email-repository');
const UpdateAccessTokenRepository = require('../../infra/repository/update-access-token-repository');
const Encrypter = require('../../utils/encrypter');
const TokenGenerator = require('../../utils/token-generator');
const env = require('../config/env');

module.exports = router => {
    const loadUserByEmailRepository = new LoadUserByEmailRepository();
    const updateAccessTokenRepository = new UpdateAccessTokenRepository();
    const encrypter = new Encrypter();
    const tokenGenerator = new TokenGenerator(env.tokenSecret);
    const emailValidator = new EmailValidator();
    const authUseCase = new AuthUseCase({
        encrypter,
        loadUserByEmailRepository,
        updateAccessTokenRepository,
        tokenGenerator
    });
    const loginRouter = new LoginRouter({ authUseCase, emailValidator });

    router.post('/login', loginRouter.route)
}