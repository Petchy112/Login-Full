const jwt = require('jsonwebtoken');
const config = require('../config');
const userAuthToken = require('../models/userAuthModel')
const FB = require('fb')
const sha1 = require('js-sha1')
const generatePasswordHash = require('../help/passwordHash')
const verifyPassword = require('../help/passwordHash')
const { OAuth2Client } = require('google-auth-library');
const user = require('../models/userModel');
const client = new OAuth2Client('871927269871-tag50bhnoj696jpbc2fdhojp1ha7uqka.apps.googleusercontent.com');

const userService = {
    async register(input) {
        console.log('register called', input)

        const userdata = new user();
        userdata.userName = input.userName,
            userdata.passwordHash = input.password,
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
        userdata.userId = userdata._id
        await userdata.save();


        var dataRes = {
            Message: 'Registered'
        }
        return dataRes

    },
    async login(userName, password) {
        console.log('login called', userName)

        var thisUser = await user.findOne({ userName })

        if (thisUser) {
            const createId = this
            if (thisUser.passwordHash !== password) {
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
            UserAuth.userId = thisUser.id
            UserAuth.userName = userName
            UserAuth.accessToken = accessToken
            UserAuth.accessTokenExpiresAt = accessTokenExpiresAt
            await UserAuth.save()



            dataRes = {
                Message: 'Login successfully',
                Token: accessToken
            }
            return dataRes
        }
        else {
            dataRes = { Message: 'Username was invalid' }
            return dataRes
        }
    },
    async revokeAccessToken(accessToken) {
        console.log('revoke called', accessToken);
        await userAuthToken.findOneAndDelete({ accessToken })
        const dataRes = {
            message: 'logged out!',
        }
        return dataRes
    },
    async getUser(accessToken) {
        console.log('get data', accessToken)
        const userTokenData = await userAuthToken.findOne({ accessToken })
        const userInfo = await user.findOne({ userId: userTokenData.userId })
        const result = {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber
        }
        console.log(result)
        return result
    },
    async loginFB(token, userid, type) {
        console.log('facebookLogin called', token);
        console.log(userid);
        console.log(type);
        const data = await FB.api('me', {
            fields: ['id', 'name', 'email', 'first_name', 'last_name'].join(','), access_token: token,
        });

        console.log(data);
        const fbUserData = new user();
        fbUserData.userId = userid,
            fbUserData.userName = data.email,
            fbUserData.firstName = data.first_name,
            fbUserData.lastName = data.last_name,
            fbUserData.email = data.email,
            fbUserData.typeLogin = type

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
        userAuth.userId = userid
        userAuth.accessToken = accessToken
        userAuth.accessTokenExpiresAt = accessTokenExpiresAt
        await userAuth.save();

        var isUserId = await user.findOne({ userid })
        if (!isUserId) {
            await fbUserData.save();
        }

        dataResponse = {
            message: 'Login successfully',
            id: userid
        }
        return dataResponse
    },
    async loginGG(idToken, type) {
        console.log('googleLogin called', idToken)
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: '871927269871-tag50bhnoj696jpbc2fdhojp1ha7uqka.apps.googleusercontent.com',
        });

        const payload = ticket.getPayload();

        const googleUser = new user();
        googleUser.userId = payload.sub,
            googleUser.userName = payload.email,
            googleUser.firstName = payload.given_name,
            googleUser.lastName = payload.family_name,
            googleUser.email = payload.email,
            googleUser.typeLogin = type

        var userId = payload.sub
        const accessTokenExpiresAt = new Date()
        const signOptionsAccessToken = {
            ...config.session.JWT,
            expiresIn: config.auth.expiresIn.accessToken
        }
        const payloadAccessToken = {
            firstName: payload.given_name,
            lastName: payload.family_name,
            email: payload.email
        }

        const expiresIn = config.auth.expiresIn.accessToken;
        accessTokenExpiresAt.setSeconds(accessTokenExpiresAt.getSeconds() + expiresIn)


        const accessToken = jwt.sign(payloadAccessToken, 'secret', signOptionsAccessToken)


        const userAuth = new userAuthToken()
        userAuth.userId = userId
        userAuth.accessToken = accessToken
        userAuth.accessTokenExpiresAt = accessTokenExpiresAt
        await userAuth.save();

        var isUserId = await user.findOne({ userId })
        if (!isUserId) {
            await googleUser.save()
        }
        resData = {
            Message: 'Login successfully',
            token: accessToken
        }
        return resData

    }
}



module.exports = userService