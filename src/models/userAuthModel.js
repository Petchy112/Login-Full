const mongoose = require('mongoose')
var schema = mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    accessToken: {
        type: String,
        require: true,
    },
    accessTokenExpireAt: {
        type: String,
        require: true
    }
})

var userAuth = mongoose.model('userAuth', schema)
module.exports = userAuth