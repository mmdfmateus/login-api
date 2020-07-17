const Encrypter = require('./encrypter');
const { MissingParameterError } = require('../utils/errors')
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
    
    test('Should throw if no params are provided', async () => {
        const sut = makeSut();

        await expect(sut.compare()).rejects.toThrow(new MissingParameterError('value'));
        await expect(sut.compare('any_value')).rejects.toThrow(new MissingParameterError('hashedValue'));
    });
});