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

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]));
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]));
}

const removeNullFieldInObject = (object) => {
    Object
        .entries(object)
        .forEach(([k, v]) => {
            if (v && typeof v === 'object') {
                removeNullFieldInObject(v);
            }
            if (v && typeof v === 'object' && !Object.keys(v).length || v === null || v === undefined) {
                if (Array.isArray(object)) {
                    object.splice(k, 1);
                } else {
                    delete object[k];
                }
            }
        });
    return object;
}

module.exports = {
    getInfoData,
    createPublicAndPrivateKey,
    getSelectData,
    getUnSelectData,
    removeNullFieldInObject
}