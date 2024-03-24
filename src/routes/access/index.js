'use strict'

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication, authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

//signin
router.post('/shop/signin', asyncHandler(accessController.signIn));
//signup
router.post('/shop/signup', asyncHandler(accessController.signUp));

//authentication
router.use(authenticationV2);

//logout
router.post('/shop/logout', asyncHandler(accessController.logout));

//handle refresh token
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));

module.exports = router;