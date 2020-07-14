const MissingParameterError = require('./missing-param-error');
const UnauthorizedError = require('./unauthorized-error');

module.exports = class HttpResponse {
    static badRequest(missingParamName) {
        return {
            statusCode: 400,
            body: new MissingParameterError(missingParamName)
        }
    }

    static internalServerError() {
        return {
            statusCode: 500
        }
    }

    static unauthorized() {
        return {
            statusCode: 401,
            body: new UnauthorizedError()
        }
    }
}