const { UnauthorizedError, InternalServerError } = require('../errors');

module.exports = class HttpResponse {
    static badRequest(error) {
        return {
            statusCode: 400,
            body: {
                error: error.message
            }
        }
    }

    static internalServerError() {
        return {
            statusCode: 500,
            body: { 
                error: new InternalServerError().message
            }
        }
    }

    static unauthorized() {
        return {
            statusCode: 401,
            body: {
                error: new UnauthorizedError().message
            }
        }
    }

    static ok(data) {
        return {
            statusCode: 200,
            body: data
        }
    }
}