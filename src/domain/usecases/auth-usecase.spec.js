const { MissingParameterError } = require("../../utils/errors");

class AuthUseCase {
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

        await this.loadUserByEmailRepository.load(email);
    }
}

class LoadUserByEmailRepository {
    async load(email) {
        this.email = email;
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

    test('Should call LoadUserByEmailRepository with correct email', async () => {
        const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository();
        const sut = new AuthUseCase(loadUserByEmailRepositorySpy);

        await sut.auth('any_mail@mail.com', 'password');

        expect(loadUserByEmailRepositorySpy.email).toBe('any_mail@mail.com');
    });
});