'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema({
    inven_product_id: {
        type: mongoose.Types.ObjectId,
        ref: "Product"
    },
    inven_location: String,
    inven_stock: {
        type: Number,
        required: true
    },
    inven_reservation: {
        type: Array,
        default: []
    } // in cart
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);