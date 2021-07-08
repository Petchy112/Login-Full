const express = require('express');
const router = express.Router();
const userService = require('../../../services/user');
const validate = require('validator');
const withAuth = require('../middleware/withAuth')
const path = require('path')
const createError = require('http-errors');




router.get('/start', async (req, res) => {
    await res.sendFile(path.join(__dirname, "../../../../", 'FRONT-END/index.html'));
})
router.get('/registerForm', async (req, res) => {
    await res.sendFile(path.join(__dirname, "../../../../", 'FRONT-END/register.html'));
})
router.get('/profile', async (req, res) => {
    await res.sendFile(path.join(__dirname, "../../../../", 'FRONT-END/profile.html'));
})
router.get('/addEvent', async (req, res) => {
    await res.sendFile(path.join(__dirname, "../../../../", 'FRONT-END/addEvent.html'));
})
router.get('/eventDetail', async (req, res) => {
    await res.sendFile(path.join(__dirname, "../../../../", 'FRONT-END/eventDetails.html'));
})
router.get('/editEvent', async (req, res) => {
    await res.sendFile(path.join(__dirname, "../../../../", 'FRONT-END/editEvent.html'));
})


router.post('/register', async (req, res, next) => {
    try {
        var { body } = req
        if (!body.userName) {
            next(createError(400, 'Username was empty'))
            return
        }
        if (!body.password) {
            next(createError(400, 'Password was empty'))
            return
        }
        if (!body.confirmPassword) {
            next(createError(400, 'Confirm Password was empty'))
            return
        }
        if (body.confirmPassword !== body.password) {
            next(createError(400, 'Password is not match'))
            return
        }
        if (!body.firstName) {
            next(createError(400, 'Firstname was empty'))
            return
        }
        if (!body.lastName) {
            next(createError(400, 'Lastname was empty'))
            return
        }
        if (!body.email) {
            next(createError(400, 'Email was empty'))
            return
        }
        if (body.email && !validate.isEmail(body.email)) {
            next(createError(400, 'Email was invalid'))
            return
        }
        if (!body.phoneNumber) {
            next(createError(400, 'Phonenumber was empty'))
            return
        }
        const user = await userService.register(body)
        await res.json(user)
    }
    catch (error) {
        next(error)
        throw error
    }
})
router.post('/login', async (req, res, next) => {
    try {
        var { body } = req
        console.log(body.userName);

        if (!body.userName) {
            next(createError(400, 'Username was empty'))
            return
        }
        if (!body.password) {
            next(createError(400, 'Password was empty'))
            return
        }
        const user = await userService.login(body.userName, body.password)
        await res.json(user)
    }
    catch (error) {
        next(error)
    }
})
router.post('/logout', withAuth, async (req, res, next) => {
    try {
        const logout = await userService.revokeAccessToken(req.headers.authorization.replace('Bearer ', ''))
        res.json(logout)

    }
    catch (error) {
        next(error)
    }
})
router.get('/data', withAuth, async (req, res, next) => {
    try {
        const result = await userService.getUser(req.headers.authorization.replace('Bearer ', ''))
        res.json(result)
    }
    catch (error) {
        next(error)
    }
})
router.post('/loginWithFb', async (req, res, next) => {
    try {
        var { headers } = req
        const user = await userService.loginFB(headers.authorization, headers.userid, headers.type);
        await res.json(user);
    }
    catch (error) {
        next(error)
    }
})
router.post('/loginWithGG', async (req, res, next) => {
    try {
        var { headers } = req
        const user = await userService.loginGG(headers.authorization, headers.type);
        await res.json(user)

    }
    catch (error) {
        next(error)
    }
})


module.exports = router