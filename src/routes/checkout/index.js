'use strict'

const express = require('express');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');
const checkoutController = require('../../controllers/checkout.controller');
const router = express.Router();

//authentication
// router.use(authenticationV2);

router.post('/review', asyncHandler(checkoutController.checkoutReview));

module.exports = router;