const LoginRouter = require('./login-router');
const { UnauthorizedError, InternalServerError } = require('../errors');
const { MissingParameterError, InvalidParameterError } = require('../../utils/errors');


const makeSut = () => {
    const authUseCaseSpy = makeAuthUseCase();
    const emailValidatorSpy = makeEmailValidator()
    const sut = new LoginRouter({ 
        authUseCase: authUseCaseSpy, 
        emailValidator: emailValidatorSpy 
    });
    
    return {
        sut,
        authUseCaseSpy,
        emailValidatorSpy
    }
};

const makeEmailValidator = () => {
    class EmailValidatorSpy {
        isValid(email) {
            this.email = email;
            return this.isEmailValid;
        };
    }
    const emailValidatorSpy = new EmailValidatorSpy();
    emailValidatorSpy.isEmailValid = true;
    return emailValidatorSpy;
}

const makeEmailValidatorWithError = () => {
    class EmailValidatorSpy {
        isValid (email) {
            throw new Error();
        };
    };   

    return new EmailValidatorSpy();
}

const makeAuthUseCase = () => {
    class AuthUseCaseSpy {
        async auth (email, password) {
            this.email = email;
            this.password = password;
            
            return this.accessToken;
        };
    };
    
    const authUseCaseSpy = new AuthUseCaseSpy();
    authUseCaseSpy.accessToken = 'valid_token';
    return authUseCaseSpy;
}

const makeAuthUseCaseWithError = () => {
    class AuthUseCaseSpy {
        async auth () {
            throw new Error();
        };
    };   

    return new AuthUseCaseSpy();
}

describe('Login Router', () => {
    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                password: 'any'
            }
        };
        const httpResponse = await sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.error).toBe(new MissingParameterError('email').message);
    });

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'any@mail.com'
            }
        };
        const httpResponse = await sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.error).toBe(new MissingParameterError('password').message);
    });

    test('Should return 500 if no httpRequest is provided', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.route();

        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.error).toBe(new InternalServerError().message);
    });

    test('Should return 500 if httpRequest has no body', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.route({});

        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.error).toBe(new InternalServerError().message);
    });

    test('Should call AuthUseCase with correct params', async () => {
        const { sut, authUseCaseSpy } = makeSut();
        const httpRequest = {
            body: {
                email: 'any@mail.com',
                password: 'any'
            }
        };

        await sut.route(httpRequest);

        expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
        expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
    });

    test('Should return 401 when invalid credentials are provided', async () => {
        const { sut, authUseCaseSpy } = makeSut();
        authUseCaseSpy.accessToken = null;
        const httpRequest = {
            body: {
                email: 'any_invalid@mail.com',
                password: 'any_invalid'
            }
        };

        const httpResponse = await sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body.error).toBe(new UnauthorizedError().message);
    });

    test('Should return 200 when valid credentials are provided', async () => {
        const { sut, authUseCaseSpy } = makeSut();
        const httpRequest = {
            body: {
                email: 'any_valid@mail.com',
                password: 'any_valid'
            }
        };

        const httpResponse = await sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body.accessToken).toBe(authUseCaseSpy.accessToken);
    });

    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorSpy } = makeSut();
        const httpRequest = {
            body: {
                email: 'any@mail.com',
                password: 'any'
            }
        };

        await sut.route(httpRequest);

        expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
    });

    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorSpy } = makeSut();
        emailValidatorSpy.isEmailValid = false;
        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                password: 'any'
            }
        };

        const httpResponse = await sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.error).toBe(new InvalidParameterError('email').message);
    });

    test('Should throw if invalid dependencies is provided', async () => {
        const invalid = {};
        const authUseCase = makeAuthUseCase();
        const suts = [].concat(
            new LoginRouter(),
            new LoginRouter({}),
            new LoginRouter({ 
                authUseCase: invalid
            }),
            new LoginRouter({ 
                authUseCase: authUseCase
            }),
            new LoginRouter({ 
                authUseCase: authUseCase,
                emailValidator: invalid
            })
        );

        for(const sut of suts){
            const httpRequest = {
                body: {
                    email: 'any@mail.com',
                    password: 'any'
                }
            };
    
            const httpResponse = await sut.route(httpRequest);
    
            expect(httpResponse.statusCode).toBe(500);
            expect(httpResponse.body.error).toBe(new InternalServerError().message);
        }
    });

    test('Should throw if dependencies throw', async () => {
        const authUseCase = makeAuthUseCase();
        const suts = [].concat(
            new LoginRouter({ 
                authUseCase: makeAuthUseCaseWithError()
            }),
            new LoginRouter({
                authUseCase: authUseCase,
                emailValidator: makeEmailValidatorWithError()
            })
        );

        for(const sut of suts){
            const httpRequest = {
                body: {
                    email: 'any@mail.com',
                    password: 'any'
                }
            };
    
            const httpResponse = await sut.route(httpRequest);
    
            expect(httpResponse.statusCode).toBe(500);
            expect(httpResponse.body.error).toBe(new InternalServerError().message);
        }
    });
});