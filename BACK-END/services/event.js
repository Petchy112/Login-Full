const Event = require('../models/eventModel');
const UserAuthToken = require('../models/userAuthModel');
const User = require('../models/userModel');

const eventService = {
    async addEvent(accessToken, topic, description) {
        try {
            console.log('add event called', topic);

            console.log(accessToken);
            const userTokenData = await UserAuthToken.findOne({ accessToken })
            console.log(userTokenData);


            const newEvent = new Event();
            newEvent.userId = userTokenData.userId
            newEvent.topic = topic,
                newEvent.description = description
            await newEvent.save();

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

            await Event.findByIdAndUpdate({ _id: topicId }, {
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
    },
    async getEvent(accessToken) {
        console.log('get event', accessToken)
        const userTokenData = await UserAuthToken.findOne({ accessToken })
        console.log(userTokenData.userId);
        const userEvent = await Event.find({ userId: userTokenData.userId }).exec()
        return userEvent
    }
}


module.exports = eventService