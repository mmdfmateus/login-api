const MissingParameterError = require('./missing-param-error');
const UnauthorizedError = require('./unauthorized-error');
const InternalServerError = require('./internal-server-error');

module.exports = class HttpResponse {
    static badRequest(missingParamName) {
        return {
            statusCode: 400,
            body: new MissingParameterError(missingParamName)
        }
    }

    static internalServerError() {
        return {
            statusCode: 500,
            body: new InternalServerError()
        }
    }

    static unauthorized() {
        return {
            statusCode: 401,
            body: new UnauthorizedError()
        }
    }

    static ok(data) {
        return {
            statusCode: 200,
            body: data
        }
    }
}