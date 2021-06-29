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
                message: 'Add event succesfully'

            }
            return dataRes
        } catch (err) {
            var dataRes = 'error'
            return dataRes
        }
    }
}


module.exports = eventService