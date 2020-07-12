class LoginRouter {
    route(httpRequest){
        if(!httpRequest || !httpRequest.body){
            return HttpResponse.internalServerError();
        }

        const { email, password } = httpRequest.body;
        if(!email){
            return HttpResponse.badRequest('email');
        }
        if(!password){
            return HttpResponse.badRequest('password');
        }
    }
}

class HttpResponse {
    static badRequest(missingParamName){
        return {
            statusCode: 400,
            body: new MissingParameterError(missingParamName)
        }
    }

    static internalServerError(){
        return {
            statusCode: 500
        }
    }
}

class MissingParameterError extends Error {
    constructor(paramName) {
        super(`Missing parameter '${paramName}'`);
        this.name = 'MissingParameterError';
    }
}

describe('Login Router', () => {
    test('Should return 400 if no email is provided', () => {
        const sut = new LoginRouter();
        const httpRequest = {
            body: {
                password: 'any'
            }
        };
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParameterError('email'));
    });

    test('Should return 400 if no password is provided', () => {
        const sut = new LoginRouter();
        const httpRequest = {
            body: {
                email: 'any@mail.com'
            }
        };
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParameterError('password'));
    });

    test('Should return 500 if no httpRequest is provided', () => {
        const sut = new LoginRouter();
        const httpResponse = sut.route();

        expect(httpResponse.statusCode).toBe(500);
    });

    test('Should return 500 if httpRequest has no body', () => {
        const sut = new LoginRouter();
        const httpResponse = sut.route({});

        expect(httpResponse.statusCode).toBe(500);
    });
});