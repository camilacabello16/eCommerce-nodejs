'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//product type Clothing
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    size: String,
    material: String
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

//product type Electronic
const electronicSchema = new Schema({
    manufactor: {
        type: String,
        required: true,
    },
    model: String,
    color: String
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

//Export the model
module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model('Clothing', productSchema),
    electronic: mongoose.model('Electronic', productSchema)
};