jest.mock('validator', () => ({
    isEmailValid: true,
    email: '',
    isEmail(email) {
        this.email = email;
        return this.isEmailValid;
    }
}));

const EmailValidator = require('./email-validator')
const validator = require('validator');
const { MissingParameterError } = require('./errors')


const makeSut = () => {
    return new EmailValidator();
}

describe('EmailValidator', () => {
    test('Should return true if validator returns true', () => {
        const sut = makeSut();
        
        const isValid = sut.isValid('valid_mail@mail.com');

        expect(isValid).toBe(true);
    });

    test('Should return false if validator returns false', () => {
        const sut = makeSut();
        validator.isEmailValid = false;
        
        const isValid = sut.isValid('invalid_mail@mail.com');

        expect(isValid).toBe(false);
    });

    test('Should call validator with correct email', () => {
        const sut = makeSut();
        
        sut.isValid('any_mail@mail.com');

        expect(validator.email).toBe('any_mail@mail.com');
    });

    test('Should throw if no email is provided', () => {
        const sut = makeSut();
        
        expect(() => { sut.isValid() }).toThrow(new MissingParameterError('email'));
    });
})