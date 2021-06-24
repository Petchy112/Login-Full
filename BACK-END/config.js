module.exports = config = {
    port: 80,
    database: {
        username: 'admin',
        password: '15918Petch',
        host: 'testmongodb.fs0qx.mongodb.net',
        database: 'test',
    },
    auth: {
        expiresIn: {
            accessToken: 60 * 60,
        }
    },
    session: {
        JWT: {
            issuer: 'JWT',
            algorithm: 'HS256',
        },
        key: 'secret'
    }

}