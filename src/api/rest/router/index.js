const user = require('./user')

exports = app => {
    app.use('/api', user)
}
