const User = require('../models/userModel')
const UniversalError = require('../error/UniversalError');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userAuthToken = require('../models/userAuthModel')

const thisService = {
    async register(input) {
        console.log('register called', input)

        const user = new User();
        user.userName = input.userName,
            user.passwordHash = sha1(input.password),
            user.firstName = input.firstName,
            user.lastName = input.lastName,
            user.email = input.email,
            user.phoneNumber = input.phoneNumber


        var isExistEmail = await User.findOne({ email: input.email })
        if (isExistEmail) {
            console.log('The email is already use!')
            return
        }
        var isExistUsername = await User.findOne({ userName: input.userName })
        if (isExistUsername) {
            console.log('Username is already use!')
            return
        }
        await user.save()

    },
    async login(userName, password) {
        console.log('login called', userName)

        var thisUser = await User.findOne({ userName })

        if (thisUser) {
            if (thisUser.passwordHash !== sha1(password)) {
                console.log('Password was invalid')

            }
            const accessTokenExpiresAt = new Date()
            const signOptionsAccessToken = {
                ...config.session.JWT,
                expiresIn: config.auth.expires.accessToken
            }
            const payloadAccessToken = {
                userName: thisUser.userName,
                email: thisUser.email,
                phoneNumber: thisUser.phoneNumber
            }


            const expiresIn = config.auth.expires.accessToken;
            accessTokenExpiresAt.setSeconds(accessTokenExpiresAt.getSeconds() + expiresIn)


            const accessToken = jwt.sign(payloadAccessToken, 'secret', signOptionsAccessToken)

            const UserAuth = new userAuthToken()
            UserAuth.userName = userName
            UserAuth.accessToken = accessToken
            UserAuth.accessTokenExpiresAt = accessTokenExpiresAt
            await UserAuth.save()

            resData = {
                Message: 'Auth Successful', token: accessToken
            }
            return resData
        }
        else {
            console.log({ Message: 'Username was invalid' })
            return
        }
    },
    async revokeAccessToken(accessToken) {
        console.log('revoke called', accessToken);
        await userAuthToken.findOneAndDelete({ accessToken })
        const res = {
            message: 'logged out!',
        }
        return res
    },
    async getUser(accessToken) {
        console.log('get data', accessToken)
        const userTokenData = userAuthToken.findOne({ accessToken })
        if (userTokenData) {
            const userData = User.findOne({ userName: userTokenData.userName })
            if (userData) {
                const result = {
                    firstName = userData.firstName,
                    lastName = userData.lastName,
                    email = userData.email,
                    phoneNumber = userData.phoneNumber
                }
                return result
            }
        }
    }
}


module.exports = thisService