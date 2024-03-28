'use strict'

const express = require('express');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();

//authentication
// router.use(authenticationV2);

router.post('/add', asyncHandler(cartController.addToCart));
router.post('/delete', asyncHandler(cartController.deleteProductInCart));
router.get('/get/:id', asyncHandler(cartController.getListProductInCart));

module.exports = router;