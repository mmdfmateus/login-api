const LoginRouter = require('../../presentation/routers/login-router');
const AuthUseCase = require('../../domain/usecases/auth-usecase');
const EmailValidator = require('../../utils/email-validator');

module.exports = router => {
    const authUseCase = new AuthUseCase();
    const emailValidator = new EmailValidator();
    const loginRouter = new LoginRouter(authUseCase, emailValidator);
    
    router.post('/login', loginRouter.route)
}