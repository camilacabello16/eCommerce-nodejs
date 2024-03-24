'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData, createPublicAndPrivateKey } = require("../utils");
const { ConflictError, BadRequestError, NotAuthorError, ForbiddenError } = require("../core/error.response");
const { findShopByEmail } = require("./shop.service");
const JWT = require('jsonwebtoken');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static handleRefreshTokenV2 = async (keyStore, user, refreshToken) => {
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            //delete key
            await KeyTokenService.deleteKeyByUserId(user.userId);
            throw new ForbiddenError('Something wrong! Please login again');
        }

        //exist token not exist - create new
        if (keyStore.refreshToken !== refreshToken) throw new ForbiddenError('Shop not registered');

        const foundShop = await findShopByEmail({ email: user.email });
        if (!foundShop) throw new ForbiddenError('Shop not registered');

        //create new key
        const tokens = await createTokenPair({ userId: foundShop._id, email: foundShop.email }, keyStore.publicKey, keyStore.privateKey);

        //update to key model
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        });

        return {
            shop: user,
            tokens
        }
    }

    static handleRefreshToken = async (refreshToken) => {
        const existRefreshToken = await KeyTokenService.getKeyByRefreshTokenUsed(refreshToken);
        //if exist token - delete all token
        if (existRefreshToken) {
            const user = await JWT.verify(refreshToken, existRefreshToken.privateKey);

            //delete key
            await KeyTokenService.deleteKeyByUserId(user.userId);
            throw new ForbiddenError('Something wrong! Please login again');
        }

        //exist token not exist - create new
        const foundToken = await KeyTokenService.getKeyByRefreshToken(refreshToken);
        if (!foundToken) throw new ForbiddenError('Shop not registered');

        const decodeShop = await JWT.verify(refreshToken, foundToken.privateKey);
        console.log("SHOP", decodeShop);
        if (!decodeShop) throw new ForbiddenError('Shop not registered');

        //create new key
        const tokens = await createTokenPair({ userId: decodeShop._id, email: decodeShop.email }, foundToken.publicKey, foundToken.privateKey);

        //update to key model
        await foundToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        });

        return {
            shop: decodeShop,
            tokens
        }
    }

    static logout = async (keyStore) => {
        return await KeyTokenService.removeById(keyStore._id);
    }

    static signIn = async ({ email, password, refreshToken = null }) => {
        //check email exist
        const shopExist = await findShopByEmail({ email });

        if (!shopExist) {
            throw new BadRequestError('Shop not registered');
        }
        //match password
        const isMatchPassword = bcrypt.compare(password, shopExist.password);

        if (!isMatchPassword) {
            throw new NotAuthorError('Shop not registered');
        }

        //create key
        const { publicKey, privateKey } = createPublicAndPrivateKey();
        //create token pair
        const tokens = await createTokenPair({ userId: shopExist._id, email }, publicKey, privateKey);
        //update token
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            publicKey, privateKey, userId: shopExist._id
        });
        return {
            shop: getInfoData(shopExist, ["_id", "name", "email"]),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        try {
            //check email exists
            const existShop = await shopModel.findOne({ email }).lean();
            if (existShop) {
                throw new ConflictError('Error: Shop already registered!');
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if (newShop) {
                // create private key, public key
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })

                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return {
                        code: '',
                        message: 'Create keyStore error'
                    }
                }

                //create token pair
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
                console.log('create token: ', tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData(newShop, ["_id", "name", "email"]),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }
        } catch (error) {
            return {
                code: '',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;