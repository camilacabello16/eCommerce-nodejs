'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    cart_status: {
        type: String, required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: {
        type: Array,
        required: true,
        default: [] //{productId, shopId, quantity, name, price}
    },
    cart_count_product: {
        type: Number,
        default: 0
    },
    cart_userId: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);