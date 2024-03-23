'use strict'

const shopModel = require("../models/shop.model")

const findShopByEmail = async ({ email }) => {
    const shopExist = await shopModel.findOne({ email }).lean();
    return shopExist;
}

module.exports = {
    findShopByEmail
}