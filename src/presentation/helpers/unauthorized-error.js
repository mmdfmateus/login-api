module.exports = class UnauthorizedError extends Error {
    constructor() {
        super('Unathorized credentials');
        this.name = 'UnauthorizedError';
    }
}