'use strict'

const express = require('express');
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');
const discountController = require('../../controllers/discount.controller');
const router = express.Router();

router.post('/cancel', asyncHandler(discountController.cancelDiscountByUser));
router.get('/products', asyncHandler(discountController.getProductInDiscount));

//authentication
router.use(authenticationV2);

router.post('/create', asyncHandler(discountController.createDiscount));
router.get('/getDiscountByShop', asyncHandler(discountController.getDiscountByShop));
router.post('/getDiscountAmount', asyncHandler(discountController.getDiscountAmount));
router.delete('/delete/:code', asyncHandler(discountController.deleteDiscount));

module.exports = router;