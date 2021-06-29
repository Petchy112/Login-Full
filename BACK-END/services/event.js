const Event = require('../models/eventModel')

const eventService = {
    async addEvent(topic, description) {
        try {
            console.log('add event called', topic);

            const newEvent = new Event();
            newEvent.topic = topic,
                newEvent.description = description
            await newEvent.save()

            var dataRes = {
                message: 'Add succesfully'

            }
            return dataRes
        } catch (err) {
            var dataRes = 'error'
            return dataRes
        }
    },
    async editEvent(topicId, topic, description) {
        try {
            console.log('edit event called', topicId);

            await Event.findOneAndUpdate({ _id: topicId }, {
                topic: topic,
                description: description
            })

            var dataRes = {
                message: 'Edit succesfully'
            }
            return dataRes
        } catch (err) {
            var dataRes = 'error'
            return dataRes
        }
    }
}


module.exports = eventService