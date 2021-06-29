const user = require('./user')
const events = require('./event')

module.exports = app => {
    app.use('/api', [user, events])
}
