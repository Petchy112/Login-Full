const mongoose = require('mongoose')
var schema = mongoose.Schema({
    topic: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: false,
        default: 'None'
    },
})

var Event = mongoose.model('Event', schema)
module.exports = Event