'use strict'

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    USER_ID: 'x-user-id'
}

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('./checkAuth');
const KeyTokenService = require('../services/keyToken.service');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        //verify use public token
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('Error verify token ', err);
            } else {
                console.log('Decode verify ', decode);
            }
        })

        return { accessToken, refreshToken };
    } catch (error) {

    }
}

const authentication = asyncHandler(async (req, res, next) => {
    // check userId header
    const userId = req.headers[HEADER.USER_ID];
    if (!userId) throw new NotAuthorError('Invalid request');

    //get access token
    const keyStore = await KeyTokenService.getKeyByUserId(userId);
    if (!keyStore) throw new NotAuthorError('Invalid request');

    // check access token header
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new NotAuthorError('Invalid request');

    console.log("R", req);

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new NotAuthorError('Invalid userId');
        req.keyStore = keyStore;
        console.log("R", req);
        return next();
    } catch (error) {
        throw error;
    }
})

module.exports = {
    createTokenPair,
    authentication
}