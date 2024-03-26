'use strict'

const inventoryModel = require("../inventory.model")

const createInventory = async ({ productId, stock, location = 'unknown' }) => {
    return await inventoryModel.create({
        inven_product_id: productId,
        inven_location: location,
        inven_stock: stock
    });
}

module.exports = {
    createInventory
}