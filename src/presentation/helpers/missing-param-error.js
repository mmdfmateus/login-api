module.exports = class MissingParameterError extends Error {
    constructor(paramName) {
        super(`Missing parameter '${paramName}'`);
        this.name = 'MissingParameterError';
    }
}