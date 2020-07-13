const MissingParameterError = require('./missing-param-error');

module.exports = class HttpResponse {
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