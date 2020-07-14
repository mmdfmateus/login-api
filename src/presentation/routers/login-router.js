const HttpResponse = require('../helpers/http-response');
const MissingParameterError = require('../helpers/missing-param-error');

module.exports = class LoginRouter {
    constructor (authUseCase) {
        this.authUseCase = authUseCase;
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
            return HttpResponse.internalServerError();
        }
    }
}