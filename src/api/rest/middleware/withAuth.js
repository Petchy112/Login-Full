const { ExpressRequest } = require('express')
const userAuth = require('../../../models/userAuthModel')
const user = require('../../../models/userModel')

// class checkAuth extends myAuth {
//     accessToken = String
//     accessTokenExpires = Date
//     userName = String
// }
class checkAuth {
    constructor() {
        accessToken = String,
            accessTokenExpires = Date,
            userName = String
    }
}

module.exports = async (req = checkAuth, res, next) => {
    try {
        if (req.headers.authorization) {
            console.log(req.headers.authorization)
            const token = req.headers.authorization.replace('Bearer ', '')
            const tokenData = userAuth.findOne({ accessToken: token })
            if (tokenData) {
                const userData = user.findOne({ userName: tokenData.userName })
                if (userData && tokenData.accessTokenExpiresAt && tokenData.accessTokenExpiresAt > new Date()) {
                    req.accessToken = tokenData.accessToken
                    req.accessTokenExpires = tokenData.accessTokenExpires
                    req.userName = tokenData.userName
                    next()
                }
                else {
                    req.userName = null
                    next()
                }
            }
            else {
                req.userName = null
                next()
            }
        }
        else {
            req.userName = null
            next()
        }
    }
    catch (error) {
        req.userName = null
        next(error)
    }
}