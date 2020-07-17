class Encrypter {
    async compare(password, hashedPassword){
        return true;
    }
}

describe('Encrypter', () => {
    test('Should return true if bcrypt returns true', async () => {
        const sut = new Encrypter();

        const isValid = await sut.compare('password', 'hashedPassword');

        expect(isValid).toBe(true);
    });
});