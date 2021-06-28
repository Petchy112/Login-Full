const express = require('express');
const router = express.Router();
const userService = require('../../../services/user');
const validate = require('validator');
const checkAuth = require('../middleware/withAuth');
const withAuth = require('../middleware/withAuth')
const path = require('path')


router.get('/start', async (req, res) => {
    await res.sendFile(path.join(__dirname, "../../../../", 'FRONT-END/index.html'));
})
router.get('/registerForm', async (req, res) => {
    await res.sendFile(path.join(__dirname, "../../../../", 'FRONT-END/register.html'));
})
router.get('/routeProfile', async (req, res) => {
    await res.sendFile(path.join(__dirname, "../../../../", 'FRONT-END/profile.html'));
})
router.post('/register', async (req, res, next) => {
    try {
        var { body } = req
        //var errors = new UniversalError()
        if (!body.userName) {
            //errors.addError('empty/userName','Username was empty.');
            await res.json('Username was empty.');
            return
        }
        else if (!body.password) {
            //errors.addError('empty/userName','Password was empty.');
            await res.json('Password was empty.');
            return
        }
        else if (!body.confirmPassword) {
            //errors.addError('empty/userName','Confirm Password was empty');
            await res.json('Confirm Password was empty')
            return
        }
        else if (body.confirmPassword !== body.password) {
            //errors.addError('match/password','Password is not match');
            await res.json('The password is not match.')
            return
        }
        if (!body.firstName) {
            //errors.addError('empty/userName','Firstname was empty');
            await res.json('Firstname was empty.');
            return
        }
        if (!body.lastName) {
            //errors.addError('empty/lastName','Lastname was empty');
            await res.json('Lastname was empty.');
            return
        }
        if (!body.email) {
            //errors.addError('empty/email','Email was empty');
            await res.json('Email was empty');
            return
        }
        else if (body.email && !validate.isEmail(body.email)) {
            //errors.addError('invalid/email','Email was invalid');
            await res.json('Email was invalid.')
            return
        }
        if (!body.phoneNumber) {
            //errors.addError('empty/phoneNumber','Phonenumber was empty');
            await res.json('Phonenumber was empty')
            return
        }
        // if(errors.amount > 0){
        //     throw errors
        // }

        const user = await userService.register(body)
        res.json(user)
    }
    catch (error) {
        next(error);
    }
})
router.post('/login', async (req, res, next) => {
    try {
        var { body } = req
        console.log(body.userName);
        // var errors = new UniversalError()
        if (!body.userName) {
            console.log('Username was empty')
            // errors.addError('empty/userName','Username was empty');
        }
        if (!body.password) {
            console.log('Password was empty')
            // errors.addError('empty/password','Password was empty');
        }
        // if (errors.amount > 0) {
        //     throw error
        // }
        const user = await userService.login(body.userName, body.password)
        await res.json(user)
    }
    catch (error) {
        res.json(error)
    }
})
router.post('/logout', withAuth, async (req, res) => {
    const logout = await userService.revokeAccessToken(req.headers.authorization.replace('Bearer ', ''))
    res.json(logout)
})
router.get('/data', withAuth, async (req, res) => {
    try {
        const result = await userService.getUser(req.headers.authorization.replace('Bearer ', ''))
        res.json(result)
    }
    catch (error) {
        res.json(error)
    }
})
router.post('/loginWithFb', async (req, res) => {
    console.log(req.headers);
    const user = await userService.loginFB(req.headers.authorization, req.headers.userid, req.headers.type);
    await res.json(user);
})
router.post('/loginWithGG', async (req, res, next) => {
    var { headers } = req
    const user = await userService.loginGG(headers.authorization, headers.type);
    await res.json(user);
})


module.exports = router