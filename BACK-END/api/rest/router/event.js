const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/withAuth')
const path = require('path');
const eventService = require('../../../services/event');
const Event = require('../../../models/eventModel')
const createError = require('http-errors')

router.get('/event', withAuth, async (req, res, next) => {
    try {
        const event = await eventService.getEvent(req.headers.authorization.replace('Bearer ', ''))
        res.json(event);
    } catch (error) {
        next(error)
    }

})
router.post('/newEvent', withAuth, async (req, res, next) => {
    try {
        var { body } = req
        if (!body.topic) {
            next(createError(400, 'Topic was empty'))
            return
        }

        const event = await eventService.addEvent(req.headers.authorization.replace('Bearer ', ''), body.topic, body.description)
        res.json(event);
    } catch (error) {
        next(error)

    }

})
router.get('/event/:_id', withAuth, async (req, res, next) => {
    var topic = req.params._id
    console.log(topic);
    await Event.findById((topic), (err, result) => {
        res.json({ result })
    })
})
router.put('/event/:_id/edit', withAuth, async (req, res, next) => {
    const event = await eventService.editEvent(req.params._id, req.body.topic, req.body.description)
    res.json(event);
})
router.delete('/event/:_id', withAuth, async (req, res, next) => {
    await Event.findByIdAndDelete((req.params._id), (err, result) => {
        if (err) return res.status(400), err;
        res.status(200).json({ message: 'Deleted' });
    })
})

module.exports = router