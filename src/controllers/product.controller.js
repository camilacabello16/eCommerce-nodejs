'use strict'

const { Ok } = require("../core/success.response");
const ProductFactory = require("../services/product.service");

class ProductController {
    createProduct = async (req, res) => {
        req.body.product_shop = req.user.userId;
        new Ok({
            message: 'Create new Product Success!',
            metadata: await ProductFactory.createProduct(req.body.product_type, req.body)
        }).send(res);
    }

    publishProduct = async (req, res) => {
        new Ok({
            message: 'Publish Product Success!',
            metadata: await ProductFactory.publishProduct({
                product_id: req.params.id
            })
        }).send(res);
    }

    unPublishProduct = async (req, res) => {
        new Ok({
            message: 'Unpublish Product Success!',
            metadata: await ProductFactory.unPublishProduct({
                product_id: req.params.id
            })
        }).send(res);
    }

    searchProduct = async (req, res) => {
        new Ok({
            message: 'Search Product Success!',
            metadata: await ProductFactory.searchProduct(req.params)
        }).send(res);
    }

    getAllProduct = async (req, res) => {
        new Ok({
            message: 'Get All Product Success!',
            metadata: await ProductFactory.getAllProduct(req.query)
        }).send(res);
    }

    getProductById = async (req, res) => {
        new Ok({
            message: 'Get One Product Success!',
            metadata: await ProductFactory.getProductById({ product_id: req.params.id })
        }).send(res);
    }

    getProductDraftByShop = async (req, res) => {
        new Ok({
            message: 'Get Product Success!',
            metadata: await ProductFactory.getProductDraftByShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }

    getProductPublishByShop = async (req, res) => {
        new Ok({
            message: 'Get Product Success!',
            metadata: await ProductFactory.getProductPublishByShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }
}

module.exports = new ProductController();