const Encrypter = require('./encrypter');
const bcrypt = require('bcrypt');

const makeSut = () => {
    const encrypter = new Encrypter();
    return encrypter;
}

describe('Encrypter', () => {
    test('Should return true if bcrypt returns true', async () => {
        const sut = makeSut();

        const isValid = await sut.compare('value', 'hashedValue');

        expect(isValid).toBe(true);
    });

    test('Should return false if bcrypt returns false', async () => {
        const sut = makeSut();
        bcrypt.isValid = false;

        const isValid = await sut.compare('invalid_value', 'hashedValue');

        expect(isValid).toBe(false);
    });
    
    test('Should call bcrypt with correct values', async () => {
        const sut = makeSut();

        await sut.compare('value', 'hashedValue');

        expect(bcrypt.value).toBe('value');
        expect(bcrypt.hashedValue).toBe('hashedValue');
    });
});