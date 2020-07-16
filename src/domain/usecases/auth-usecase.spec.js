const { MissingParameterError } = require("../../utils/errors");
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
    class LoadUserByEmailRepository {
        async load(email) {
            this.email = email;
            return this.user;
        }
    }

    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository();
    loadUserByEmailRepositorySpy.user = {};
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy);

    return {
        loadUserByEmailRepositorySpy,
        sut
    }
}

describe('AuthUseCase', () => {
    test('Should throw if no email is provided', async () => {
        const { sut } = makeSut();
        const promise = sut.auth();

        await expect(promise).rejects.toThrow(new MissingParameterError('email'));
    });

    test('Should throw if no password is provided', async () => {
        const { sut } = makeSut();
        const promise = sut.auth('any_mail@mail.com');

        await expect(promise).rejects.toThrow(new MissingParameterError('password'));
    });

    test('Should call LoadUserByEmailRepository with correct email', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut();

        await sut.auth('any_mail@mail.com', 'password');

        expect(loadUserByEmailRepositorySpy.email).toBe('any_mail@mail.com');
    });

    test('Should throw if no LoadUserByEmailRepository is provided', async () => {
        const sut = new AuthUseCase();

        const promise = sut.auth('any_mail@mail.com', 'password');

        await expect(promise).rejects.toThrow();
    });

    test('Should throw if LoadUserByEmailRepository has no load method', async () => {
        const sut = new AuthUseCase({});

        const promise = sut.auth('any_mail@mail.com', 'password');

        await expect(promise).rejects.toThrow();
    });

    test('Should return null if an invalid email is provided', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut();
        loadUserByEmailRepositorySpy.user = null;

        const token = await sut.auth('invalid_mail@mail.com', 'any_password');

        expect(token).toBeNull();
    });

    test('Should return null if an invalid password is provided', async () => {
        const { sut } = makeSut();

        const token = await sut.auth('valid_mail@mail.com', 'invalid_password');

        expect(token).toBeNull();
    });
});