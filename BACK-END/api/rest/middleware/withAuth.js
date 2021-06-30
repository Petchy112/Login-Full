const UserAuthToken = require('../../../models/userAuthModel')
const User = require('../../../models/userModel')
const ExpressRequest = require('express')


class checkAuth extends ExpressRequest {
    constructor() {
        accessToken = String,
            accessTokenExpiresAt = Date,
            userId = String
    }
}

module.exports = async (req = checkAuth, res, next) => {
    try {
        if (req.headers.authorization) {
            console.log(req.headers.authorization, 'withAuthhhh')
            const token = req.headers.authorization.replace('Bearer ', '')
            const tokenData = await UserAuthToken.findOne({ accessToken: token })
            if (tokenData) {
                console.log(tokenData.accessToken);
                const userData = await User.findOne({ userId: tokenData.userId })
                var date = new Date().toString({
                    timeZone: 'Asia/Bangkok'
                });
                console.log(date);
                console.log(tokenData.accessTokenExpiresAt);
                if (userData && tokenData.accessTokenExpiresAt && tokenData.accessTokenExpiresAt > date) {
                    tokenData.accessToken = tokenData.accessToken
                    tokenData.accessTokenExpiresAt = tokenData.accessTokenExpiresAt
                    tokenData.userId = tokenData.userId
                    await tokenData.save();
                    next()
                }
                else {
                    console.log(date);
                    tokenData.userId = null
                    await tokenData.save();
                    next()
                }
            }
            else {
                req.userId = null
                next()
            }
        }
        else {
            req.userId = null

            next()
        }
    }
    catch (error) {
        req.userId = null
        next(error)
    }
}