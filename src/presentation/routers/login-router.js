const HttpResponse = require('../helpers/http-response');
const { MissingParameterError, InvalidParameterError } = require('../../utils/errors');


module.exports = class LoginRouter {
    constructor ({ authUseCase, emailValidator } = {}) {
        this.authUseCase = authUseCase;
        this.emailValidator = emailValidator;
    }

    async route(httpRequest){
        try {
            if(!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.auth){
                return HttpResponse.internalServerError();
            }
            
            const { email, password } = httpRequest.body;
            if(!email){
                return HttpResponse.badRequest(new MissingParameterError('email'));
            }

            if(!this.emailValidator.isValid(email)) {
                return HttpResponse.badRequest(new InvalidParameterError('email'));
            }

            if(!password){
                return HttpResponse.badRequest(new MissingParameterError('password'));
            }
            
            const accessToken = await this.authUseCase.auth(email, password);
            if(!accessToken) {
                return HttpResponse.unauthorized();
            }
            
            return HttpResponse.ok({ accessToken: accessToken });
        } 
        catch (error) {
            console.error(error);
            return HttpResponse.internalServerError();
        }
    }
}