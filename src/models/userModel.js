const mongoose = require('mongoose')
var schema = mongoose.Schema({
    userName: {
        type: String,
        require: true
    },
    passwordHash: {
        type: String,
        require: false
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
})

var user = mongoose.model('user', schema)
module.exports = user