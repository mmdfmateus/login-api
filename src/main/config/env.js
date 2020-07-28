const { connectionString } = require('../secrets/mongo');

module.exports = {
    mongoUrl: process.env.MONGO_URL || connectionString,
    tokenSecret: process.env.TOKEN_SECRET || 'secret',
    port: process.env.PORT || 5858
}