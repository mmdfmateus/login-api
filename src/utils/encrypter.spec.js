const bcrypt = require('bcrypt');

class Encrypter {
    async compare(value, hashedValue){
        const isValid = await bcrypt.compare(value, hashedValue);
        return isValid;
    }
}

describe('Encrypter', () => {
    test('Should return true if bcrypt returns true', async () => {
        const sut = new Encrypter();

        const isValid = await sut.compare('value', 'hashedValue');

        expect(isValid).toBe(true);
    });

    test('Should return false if bcrypt returns false', async () => {
        const sut = new Encrypter();
        bcrypt.isValid = false;

        const isValid = await sut.compare('invalid_value', 'hashedValue');

        expect(isValid).toBe(false);
    });
});