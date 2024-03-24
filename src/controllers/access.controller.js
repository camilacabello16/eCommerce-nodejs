'use strict'

const { Created, Ok } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    handleRefreshToken = async (req, res) => {
        new Ok({
            message: 'Handle Refresh Token Success!',
            metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        }).send(res);
    }

    signIn = async (req, res) => {
        new Ok({
            message: 'Signin Success!',
            metadata: await AccessService.signIn(req.body)
        }).send(res);
    }

    signUp = async (req, res, next) => {
        new Created({
            message: 'Registered Success!',
            metadata: await AccessService.signUp(req.body)
        }).send(res);
    }

    logout = async (req, res) => {
        new Ok({
            message: 'Logout Success!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }
}

module.exports = new AccessController();