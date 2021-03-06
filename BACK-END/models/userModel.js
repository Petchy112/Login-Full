const mongoose = require('mongoose')
var schema = mongoose.Schema({
    userId: {
        type: String,
        require: false
    },
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
        require: false,
        default: 'None'
    },
    typeLogin: {
        type: String,
        require: false,
        default: 'email_password'
    }
})

var User = mongoose.model('user', schema)
module.exports = User