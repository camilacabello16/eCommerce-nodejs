'use strict'

const cartModel = require("../cart.model");

const createCart = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_status: 'active' },
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        },
        options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
}

const updateCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_status: 'active'
    }, updateSet = {
        $inc: {
            'cart.products.$.quantity': quantity
        }
    }, options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateSet, options);
}

module.exports = {
    createCart,
    updateCartQuantity
}