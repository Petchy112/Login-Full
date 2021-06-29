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
router.post('/edit', async (req, res) => {
    var obj = new lotto(req.body);
    await obj.save((err, data) => {
        if (err) return res.status(400), err;
        res.json({ Message: 'Inserted' })
    })
})
router.delete('/:_id', async (req, res) => {
    await findByIdAndDelete((req.params._id), (err, result) => {
        if (err) return res.status(400), err;
        res.status(200).json({ message: 'Deleted' });
    })
})

module.exports = router