const jwt = require('jsonwebtoken');

const makeSut = () => {
    class TokenGenerator {
        async generate(id){
            return jwt.sign(id, 'secret');
        }
    }

    const tokenGenerator = new TokenGenerator();
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
});