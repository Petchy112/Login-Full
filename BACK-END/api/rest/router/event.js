const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/withAuth')
const path = require('path');
const eventService = require('../../../services/event');
const Event = require('../../../models/eventModel')

router.get('/event', withAuth, async (req, res) => {
    const event = await Event.find().exec()
    res.json(event);
})
router.post('/newEvent', withAuth, async (req, res) => {
    var { body } = req
    if (!body.topic) {
        console.log("Enter The Topic");
    }
    const event = await eventService.addEvent(body.topic, body.description)
    res.json(event);
})
router.get('/event/:_id', withAuth, async (req, res) => {
    var topic = req.params._id
    console.log(topic);
    await Event.findById((topic), (err, result) => {
        res.json({ result })
    })
})
router.put('/event/edit/:_id', async (req, res) => {
    const event = await eventService.editEvent(req.params._id, req.body.topic, req.body.description)
    res.json(event);
})
router.delete('/:_id', async (req, res) => {
    await findByIdAndDelete((req.params._id), (err, result) => {
        if (err) return res.status(400), err;
        res.status(200).json({ message: 'Deleted' });
    })
})

module.exports = router