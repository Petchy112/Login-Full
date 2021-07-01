const mongoose = require('mongoose')
var schema = mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    topic: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: false,
        default: 'None',
    },
})

var Event = mongoose.model('Event', schema)
module.exports = Event