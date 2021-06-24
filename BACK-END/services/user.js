const user = require('../models/userModel')
const jwt = require('jsonwebtoken');
const config = require('../config');
const userAuthToken = require('../models/userAuthModel')
const FB = require('fb')
const sha1 = require('js-sha1')
const generatePasswordHash = require('../help/passwordHash')
const verifyPassword = require('../help/passwordHash')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('871927269871-tag50bhnoj696jpbc2fdhojp1ha7uqka.apps.googleusercontent.com');

const userService = {
    async register(input) {
        console.log('register called', input)

        const userdata = new user();
        userdata.userName = input.userName,
            userdata.passwordHash = sha1(input.password),
            userdata.firstName = input.firstName,
            userdata.lastName = input.lastName,
            userdata.email = input.email,
            userdata.phoneNumber = input.phoneNumber


        var isExistEmail = await user.findOne({ email: input.email })
        if (isExistEmail) {
            dataRes = ('The email is already use!')
            return dataRes
        }
        var isExistUsername = await user.findOne({ userName: input.userName })
        if (isExistUsername) {
            dataRes = ('Username is already use!')
            return dataRes
        }
        await userdata.save();

    },
    async login(userName, password) {
        console.log('login called', userName)

        var thisUser = await user.findOne({ userName })

        if (thisUser) {
            if (thisUser.passwordHash !== sha1(password)) {
                console.log('Password was invalid')

            }
            const accessTokenExpiresAt = new Date()
            const signOptionsAccessToken = {
                ...config.session.JWT,
                expiresIn: config.auth.expiresIn.accessToken
            }
            const payloadAccessToken = {
                userName: thisUser.userName,
                email: thisUser.email,
                phoneNumber: thisUser.phoneNumber
            }


            const expiresIn = config.auth.expiresIn.accessToken;
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
            return Error
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
            const userData = user.findOne({ userName: userTokenData.userName })
            if (userData) {
                const result = {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber
                }
                return result
            }
        }
    },
    async loginFB(token, userID) {
        console.log('facebookLogin called', token);
        const data = await FB.api('me', {
            fields: ['id', 'name', 'email', 'first_name', 'last_name'].join(','), access_token: token,
        });

        console.log(data);
        const fbUserData = new user();
        fbUserData.userId = userID,
            fbUserData.userName = data.email,
            fbUserData.firstName = data.first_name,
            fbUserData.lastName = data.last_name,
            fbUserData.email = data.email

        const accessTokenExpiresAt = new Date()
        const signOptionsAccessToken = {
            ...config.session.JWT,
            expiresIn: config.auth.expiresIn.accessToken
        }
        const payloadAccessToken = {
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email
        }

        const expiresIn = config.auth.expiresIn.accessToken;
        accessTokenExpiresAt.setSeconds(accessTokenExpiresAt.getSeconds() + expiresIn)


        const accessToken = jwt.sign(payloadAccessToken, 'secret', signOptionsAccessToken)


        const userAuth = new userAuthToken()
        userAuth.userId = userID
        userAuth.accessToken = accessToken
        userAuth.accessTokenExpiresAt = accessTokenExpiresAt
        await userAuth.save();

        var isUserId = await user.findOne({ userID })
        if (!isUserId) {
            await fbUserData.save();
        }

        dataResponse = {
            message: 'Auth Successful',
            id: userID
        }
        return dataResponse
    },
    async loginGG(idToken) {
        console.log('googleLogin called', idToken)
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: '871927269871-tag50bhnoj696jpbc2fdhojp1ha7uqka.apps.googleusercontent.com',
        });

        const payload = ticket.getPayload();

        const googleUser = new user();
        googleUser.userName = payload.given_name,
            googleUser.firstName = payload.given_name,
            googleUser.lastName = payload.family_name,
            googleUser.email = payload.email
        await googleUser.save()
        resData = {
            Message: 'Auth Successful'
        }
        return resData

    }
}



module.exports = userService