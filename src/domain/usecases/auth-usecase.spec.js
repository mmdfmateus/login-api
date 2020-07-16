const { MissingParameterError, InvalidParameterError } = require("../../utils/errors");

const makeSut = () => {
    class LoadUserByEmailRepository {
        async load(email) {
            this.email = email;
        }
    }

    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository();
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy);

    return {
        loadUserByEmailRepositorySpy,
        sut
    }
}

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

        if(!this.loadUserByEmailRepository) {
            throw new MissingParameterError('loadUserByEmailRepository');
        }

        if(!this.loadUserByEmailRepository.load) {
            throw new InvalidParameterError('loadUserByEmailRepository');
        }

        const user = await this.loadUserByEmailRepository.load(email);
        if(!user){
            return null;
        }
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

        await expect(promise).rejects.toThrow(new MissingParameterError('loadUserByEmailRepository'));
    });

    test('Should throw if LoadUserByEmailRepository has no load method', async () => {
        const sut = new AuthUseCase({});

        const promise = sut.auth('any_mail@mail.com', 'password');

        await expect(promise).rejects.toThrow(new InvalidParameterError('loadUserByEmailRepository'));
    });

    test('Should return null if LoadUserByEmailRepository returns null', async () => {
        const { sut } = makeSut();

        const token = await sut.auth('invalid_mail@mail.com', 'any_password');

        expect(token).toBeNull();
    });
});