'use strict'

const _ = require('lodash');
const crypto = require('crypto');

const getInfoData = (object = {}, fields = []) => {
    return _.pick(object, fields);
}

const createPublicAndPrivateKey = () => {
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    return { publicKey, privateKey };
}

module.exports = {
    getInfoData,
    createPublicAndPrivateKey
}