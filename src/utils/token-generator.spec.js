const jwt = require('jsonwebtoken');
const { MissingParameterError } = require('./errors')

class TokenGenerator {
    constructor(secret){
        this.secret = secret;
    }

    async generate(id){
        if(!this.secret){
            throw new MissingParameterError('secret');
        }
        if(!id){
            throw new MissingParameterError('id');
        }
        return jwt.sign(id, this.secret);
    }
}

const makeSut = () => {

    const tokenGenerator = new TokenGenerator('secret');
    return tokenGenerator;
}

describe('Token Generator', () => {
    test('Should return null if JWT returns null', async () => {
        const sut = makeSut();
        jwt.token = null;

        const token = await sut.generate('any_id');

        expect(token).toBeNull();
    });

    test('Should return a token if JWT returns token', async () => {
        const sut = makeSut();

        const token = await sut.generate('any_id');

        expect(token).toBe(jwt.token);
    });

    test('Should call JWT with correct params', async () => {
        const sut = makeSut();

        await sut.generate('any_id');

        expect(jwt.id).toBe('any_id');
        expect(jwt.secret).toBe(sut.secret);
    });

    test('Should throw if no secret is provided', async () => {
        const sut = new TokenGenerator();

        const promise = sut.generate('any_id');

        await expect(promise).rejects.toThrow(new MissingParameterError('secret'));
    });

    test('Should throw if no id is provided', async () => {
        const sut = makeSut();

        const promise = sut.generate();

        await expect(promise).rejects.toThrow(new MissingParameterError('id'));
    });
});