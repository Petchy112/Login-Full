const jwt = require('jsonwebtoken');
const config = require('../config');
const UserAuthToken = require('../models/userAuthModel')
const FB = require('fb')
const sha1 = require('js-sha1')
const generatePasswordHash = require('../help/passwordHash')
const verifyPassword = require('../help/passwordHash')
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/userModel');
const client = new OAuth2Client('871927269871-tag50bhnoj696jpbc2fdhojp1ha7uqka.apps.googleusercontent.com');

const userService = {
    async register(input) {
        console.log('register called', input)

        const userdata = new User();
        userdata.userName = input.userName,
            userdata.passwordHash = input.password,
            userdata.firstName = input.firstName,
            userdata.lastName = input.lastName,
            userdata.email = input.email,
            userdata.phoneNumber = input.phoneNumber

        var isExistEmail = await User.findOne({ email: input.email })
        if (isExistEmail) {
            dataRes = ('The email is already use!')
            return dataRes
        }
        var isExistUsername = await User.findOne({ userName: input.userName })
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

        var thisUser = await User.findOne({ userName })

        if (thisUser) {
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

            const UserAuth = new UserAuthToken()
            UserAuth.userId = thisUser.id
            UserAuth.userName = userName
            UserAuth.accessToken = accessToken
            UserAuth.accessTokenExpiresAt = accessTokenExpiresAt
            await UserAuth.save()



            dataRes = {
                Message: 'Login successfully',
                accessToken: accessToken
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
        await UserAuthToken.findOneAndDelete({ accessToken })
        const dataRes = {
            message: 'logged out!',
        }
        return dataRes
    },
    async getUser(accessToken) {
        console.log('get data', accessToken)
        const userTokenData = await UserAuthToken.findOne({ accessToken })
        const userInfo = await User.findOne({ userId: userTokenData.userId })
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

        const data = await FB.api('me', {
            fields: ['id', 'name', 'email', 'first_name', 'last_name'].join(','), access_token: token,
        });

        const fbUserData = new User();
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


        const userAuth = new UserAuthToken()
        userAuth.userId = userid
        userAuth.accessToken = accessToken
        userAuth.accessTokenExpiresAt = accessTokenExpiresAt
        await userAuth.save();

        var isFbUserId = await User.findOne({ userId: userid })
        if (!isFbUserId) {
            await fbUserData.save();
        }

        dataResponse = {
            message: 'Login successfully',
            accessToken: accessToken
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

        const googleUser = new User();
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


        const userAuth = new UserAuthToken()
        userAuth.userId = userId
        userAuth.accessToken = accessToken
        userAuth.accessTokenExpiresAt = accessTokenExpiresAt
        await userAuth.save();

        var isUserId = await User.findOne({ userId })
        if (!isUserId) {
            await googleUser.save()
        }
        resData = {
            Message: 'Login successfully',
            accessToken: accessToken
        }
        return resData

    }
}



module.exports = userService