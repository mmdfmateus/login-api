const { MissingParameterError } = require("../../utils/errors");

class AuthUseCase {
    async auth(email, password) {
        if(!email) {
            throw new MissingParameterError('email');
        }

        if(!password) {
            throw new MissingParameterError('password');
        }

    }
}

describe('AuthUseCase', () => {
    test('Should throw if no email is provided', async () => {
        const sut = new AuthUseCase();
        const promise = sut.auth();

        expect(promise).rejects.toThrow(new MissingParameterError('email'));
    });

    test('Should throw if no password is provided', async () => {
        const sut = new AuthUseCase();
        const promise = sut.auth('any_mail@mail.com');

        expect(promise).rejects.toThrow(new MissingParameterError('password'));
    });
});