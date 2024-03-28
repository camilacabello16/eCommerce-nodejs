'use strict'

const { Ok } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res) => {
        new Ok({
            message: 'addToCart Success!',
            metadata: await CartService.addToCart(req.body)
        }).send(res);
    }

    deleteProductInCart = async (req, res) => {
        new Ok({
            message: 'deleteProductInCart Success!',
            metadata: await CartService.deleteProductInCart(req.body)
        }).send(res);
    }

    getListProductInCart = async (req, res) => {
        new Ok({
            message: 'getListProductInCart Success!',
            metadata: await CartService.getListProductInCart(req.params)
        }).send(res);
    }
}

module.exports = new CartController();