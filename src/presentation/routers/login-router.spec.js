const LoginRouter = require('./login-router');
const MissingParameterError = require('../helpers/missing-param-error');

const makeSut = () => {
    return new LoginRouter();
};

describe('Login Router', () => {
    test('Should return 400 if no email is provided', () => {
        const sut = makeSut();
        const httpRequest = {
            body: {
                password: 'any'
            }
        };
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParameterError('email'));
    });

    test('Should return 400 if no password is provided', () => {
        const sut = makeSut();
        const httpRequest = {
            body: {
                email: 'any@mail.com'
            }
        };
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParameterError('password'));
    });

    test('Should return 500 if no httpRequest is provided', () => {
        const sut = makeSut();
        const httpResponse = sut.route();

        expect(httpResponse.statusCode).toBe(500);
    });

    test('Should return 500 if httpRequest has no body', () => {
        const sut = makeSut();
        const httpResponse = sut.route({});

        expect(httpResponse.statusCode).toBe(500);
    });
});