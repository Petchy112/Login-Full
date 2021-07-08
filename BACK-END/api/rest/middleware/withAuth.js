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
            console.log(req.headers.authorization, 'withAuth')
            const token = req.headers.authorization.replace('Bearer ', '')
            const tokenData = await UserAuthToken.findOne({ accessToken: token })
            if (tokenData) {
                const userData = await User.findOne({ userId: tokenData.userId })
                var date = new Date().toString({
                    timeZone: 'Asia/Bangkok'
                });
                if (userData && tokenData.accessTokenExpiresAt && tokenData.accessTokenExpiresAt > date) {
                    ExpressRequest.accessToken = tokenData.accessToken
                    ExpressRequest.accessTokenExpiresAt = tokenData.accessTokenExpiresAt
                    ExpressRequest.userId = tokenData.userId
                    next()
                }
                else {
                    console.log(date);
                    ExpressRequest.userId = null
                    next()
                }
            }
            else {
                ExpressRequest.userId = null
                next()
            }
        }
        else {
            ExpressRequest.userId = null

            next()
        }
    }
    catch (error) {
        ExpressRequest.userId = null
        next(error)
    }
}