'use strict'

const apikeyModel = require("../models/apikey.model")

const findById = async (key) => {
    const existKey = await apikeyModel.findOne({ key, status: true }).lean();
    return existKey;
}

module.exports = {
    findById
}