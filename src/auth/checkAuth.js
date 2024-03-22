'use strict'

const { findApiKeyById } = require("../services/apikey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const checkApiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        //check exist api key
        const existKey = await findApiKeyById(key);
        if (!existKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        req.objKey = existKey;
        return next();
    } catch (error) {

    }
}

const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission Denied'
            })
        }

        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: 'Permission Denied'
            })
        }

        return next();
    }
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

module.exports = {
    checkApiKey,
    checkPermission,
    asyncHandler
}