'use strict'

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            // const publicKeyStr = publicKey.toString();
            const keyToken = await keytokenModel.create({
                user: userId,
                publicKey: publicKey,
                privateKey
            });

            return keyToken ? keyToken : null;
        } catch (error) {
            return error;
        }
    }
}

module.exports = KeyTokenService;