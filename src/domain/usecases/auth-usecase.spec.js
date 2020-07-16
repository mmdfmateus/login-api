const { MissingParameterError } = require("../../utils/errors");
const AuthUseCase = require('./auth-usecase');

const makeSut = () => {
    const encrypterSpy = makeEncrypter();
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
    const tokenGeneratorSpy = makeTokenGenerator();
    const sut = new AuthUseCase({
        loadUserByEmailRepository: loadUserByEmailRepositorySpy, 
        encrypter: encrypterSpy, 
        tokenGenerator: tokenGeneratorSpy
    });

    return {
        encrypterSpy,
        loadUserByEmailRepositorySpy,
        tokenGeneratorSpy,
        sut
    }
}

const makeEncrypter = () => {
    class Encrypter {
        async compare(password, hashedPassword) {
            this.password = password;
            this.hashedPassword = hashedPassword;
            return this.isValid;
        }
    }

    const encrypterSpy = new Encrypter();
    encrypterSpy.isValid = true;
    return encrypterSpy;
}

const makeEncrypterWithError = () => {
    class Encrypter {
        async compare() {
            throw new Error();
        }
    }

    const encrypterSpy = new Encrypter();
    return encrypterSpy;
}

const makeLoadUserByEmailRepository = () => {
    class LoadUserByEmailRepository {
        async load(email) {
            this.email = email;
            return this.user;
        }
    }
    
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository();
    loadUserByEmailRepositorySpy.user = {
        id: 'user_id',
        password: 'hashed_password'
    };
    return loadUserByEmailRepositorySpy;
}

const makeLoadUserByEmailRepositoryWithError = () => {
    class LoadUserByEmailRepository {
        async load() {
            throw new Error()
        }
    }
    
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository();
    return loadUserByEmailRepositorySpy;
}

const makeTokenGenerator = () => {
    class TokenGenerator {
        async generate(userId) {
            this.userId = userId;
            return this.accessToken;
        }
    }

    const tokenGeneratorSpy = new TokenGenerator();
    tokenGeneratorSpy.accessToken = 'valid_token';
    return tokenGeneratorSpy;
}

const makeTokenGeneratorWithError = () => {
    class TokenGenerator {
        async generate() {
            throw new Error()
        }
    }

    const tokenGeneratorSpy = new TokenGenerator();
    return tokenGeneratorSpy;
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

    test('Should return null if an invalid email is provided', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut();
        loadUserByEmailRepositorySpy.user = null;

        const token = await sut.auth('invalid_mail@mail.com', 'any_password');

        expect(token).toBeNull();
    });

    test('Should return null if an invalid password is provided', async () => {
        const { sut, encrypterSpy } = makeSut();
        encrypterSpy.isValid = false;

        const token = await sut.auth('valid_mail@mail.com', 'invalid_password');

        expect(token).toBeNull();
    });

    test('Should call Encrypter with correct params', async () => {
        const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();

        await sut.auth('valid_mail@mail.com', 'any_password');

        expect(encrypterSpy.password).toBe('any_password');
        expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password);
    });

    test('Should call TokenGenerator with correct param', async () => {
        const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();

        await sut.auth('valid_mail@mail.com', 'valid_password');

        expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
    });

    test('Should return accessToken if valid credentials are provided', async () => {
        const { sut, tokenGeneratorSpy } = makeSut();

        const accessToken = await sut.auth('valid_mail@mail.com', 'valid_password');

        expect(tokenGeneratorSpy.accessToken).toBe(accessToken);
        expect(tokenGeneratorSpy.accessToken).toBeTruthy();
    });

    test('Should throw if invalid dependencies is provided', async () => {
        const invalid = {};
        const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
        const encrypterSpy = makeEncrypter();
        const suts = [].concat(
            new AuthUseCase(),
            new AuthUseCase({ 
                loadUserByEmailRepository: null
            }),
            new AuthUseCase({ 
                loadUserByEmailRepository: invalid 
            }),
            new AuthUseCase({ 
                loadUserByEmailRepository: loadUserByEmailRepositorySpy,
                encrypter: null
            }),
            new AuthUseCase({ 
                loadUserByEmailRepository: loadUserByEmailRepositorySpy,
                encrypter: invalid
            }),
            new AuthUseCase({ 
                loadUserByEmailRepository: loadUserByEmailRepositorySpy,
                encrypter: encrypterSpy,
                tokenGenerator: null
            }),
            new AuthUseCase({ 
                loadUserByEmailRepository: loadUserByEmailRepositorySpy,
                encrypter: encrypterSpy,
                tokenGenerator: invalid
            })
        );

        for(const sut of suts){
            const promise = sut.auth('any_mail@mail.com', 'password');
            await expect(promise).rejects.toThrow();
        }
    });
    
    test('Should throw if dependencies throw', async () => {
        const loadUserByEmailRepository = makeLoadUserByEmailRepository();
        const encrypterSpy = makeEncrypter();
        const suts = [].concat(
            new AuthUseCase({ 
                loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError()
            }),
            new AuthUseCase({
                loadUserByEmailRepository: loadUserByEmailRepository,
                encrypter: makeEncrypterWithError()
            }),
            new AuthUseCase({
                loadUserByEmailRepository: loadUserByEmailRepository,
                encrypter: encrypterSpy,
                tokenGenerator: makeTokenGeneratorWithError()
            })
        );

        for(const sut of suts){
            const promise = sut.auth('any_mail@mail.com', 'password');
            await expect(promise).rejects.toThrow();
        }
    });
});