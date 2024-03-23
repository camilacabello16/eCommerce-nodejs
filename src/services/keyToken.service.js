'use strict'

const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken = null }) => {
        try {
            // const keyToken = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey
            // });

            // return keyToken ? keyToken : null;
            const filter = { user: userId },
                update = {
                    publicKey, privateKey, refreshTokensUsed: [], refreshToken
                },
                options = { upsert: true, new: true };

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }

    static getKeyByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: userId }).lean();
    }

    static removeById = async (id) => {
        return await keytokenModel.deleteOne({ _id: id });
    }
}

module.exports = KeyTokenService;