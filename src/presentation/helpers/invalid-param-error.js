module.exports = class InvalidParameterError extends Error {
    constructor(paramName) {
        super(`Invalid parameter '${paramName}'`);
        this.name = 'InvalidParameterError';
    }
}