'use strict'

const { getSelectData } = require("../../utils");
const discountModel = require("../discount.model");

const findDiscount = async ({ limit, page, sort, filter, select }) => {
    const sortBy = sort === 'ctime' ? { _id: -1 } : { id: 1 };
    const skipAt = (page - 1) * limit;
    return await discountModel.find(filter)
        .sort(sortBy)
        .skip(skipAt)
        .limit(limit)
        .select(getSelectData(select))
        .lean();
}

const getActiveDiscount = async ({ filter }) => {
    return await discountModel.findOne(filter).lean();
}

module.exports = {
    findDiscount,
    getActiveDiscount
};