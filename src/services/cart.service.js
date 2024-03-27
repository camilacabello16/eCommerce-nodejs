'use strict'

const cartModel = require("../models/cart.model");
const { createCart, updateCartQuantity } = require("../models/repositories/cart.repo");

class CartService {
    static async addToCart({ userId, product = {} }) {
        const userCart = await cartModel.findOne({ cart_userId: userId, cart_status: 'active' });

        if (!userCart) {
            //create cart
            return await createCart({ userId, product });
        }

        // if cart exist and not have product
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save();
        }

        //cart exist and product not in cart
        const foundProductInCart = userCart.cart_products.find(o => o.productId == product.productId);
        if (!foundProductInCart) {
            userCart.cart_products.push(product);
            return await userCart.save();
        }

        //cart exist and product in cart
        return await updateCartQuantity({ userId, product });
    }
}

module.exports = CartService;