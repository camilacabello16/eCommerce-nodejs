'use strict'

const express = require('express');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication, authenticationV2 } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();

//search product
router.get('/search/:keyword', asyncHandler(productController.searchProduct));
router.get('', asyncHandler(productController.getAllProduct));
router.get('/:id', asyncHandler(productController.getProductById));

//authentication
router.use(authenticationV2);

//createProduct
router.post('/createProduct', asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProduct));
router.post('/unPublish/:id', asyncHandler(productController.unPublishProduct));

//get product
router.get('/getProductDraftByShop', asyncHandler(productController.getProductDraftByShop));
router.get('/getProductPublishByShop', asyncHandler(productController.getProductPublishByShop));

module.exports = router;