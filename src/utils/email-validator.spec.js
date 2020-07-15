const validator = require('validator');

class EmailValidator {
    isValid(email) {
        return validator.isEmail(email);
    }
}

describe('EmailValidator', () => {
    test('Should return true if validator returns true', () => {
        const sut = new EmailValidator();
        
        const isValid = sut.isValid('any_mail@mail.com');

        expect(isValid).toBe(true);
    });

    test('Should return false if validator returns false', () => {
        const sut = new EmailValidator();
        validator.isEmailValid = false;
        
        const isValid = sut.isValid('invalid_mail@mail.com');

        expect(isValid).toBe(false);
    });
})