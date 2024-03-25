'use strict'

const { getSelectData, getUnSelectData } = require("../../utils");
const { product } = require("../product.model")

const getProduct = async ({ query, skip, limit }) => {
    return await product.find(query)
        .populate('product_shop', 'name email')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
}

const publishProduct = async ({ product_id }) => {
    const foundProduct = await product.findOne({ _id: product_id });
    if (!foundProduct) return null;

    foundProduct.isDraft = false;
    foundProduct.isPublished = true;

    const { modifiedCount } = await foundProduct.updateOne(foundProduct);

    return modifiedCount;
}

const unPublishProduct = async ({ product_id }) => {
    const foundProduct = await product.findOne({ _id: product_id });
    if (!foundProduct) return null;

    foundProduct.isDraft = false;
    foundProduct.isPublished = false;

    const { modifiedCount } = await foundProduct.updateOne(foundProduct);

    return modifiedCount;
}

const searchProduct = async ({ keyword }) => {
    const regexSearch = new RegExp(keyword);
    const result = await product.find({
        isPublished: true,
        $text: { $search: regexSearch }
    },
        {
            score: { $meta: 'textScore' }
        }).sort({
            score: { $meta: 'textScore' }
        }).lean();

    return result;
}

const getAllProduct = async ({ skip, limit, sort, filter, select }) => {
    const sortBy = sort === 'ctime' ? { _id: -1 } : { id: 1 };
    const skipAt = (skip - 1) * limit;
    return await product.find(filter)
        .sort(sortBy)
        .skip(skipAt)
        .limit(limit)
        .select(getSelectData(select))
        .lean();
}

const getProductById = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(getUnSelectData(unSelect)).lean();
}

const updateProductById = async ({ product_id, payload, model, isNew = true }) => {
    return await model.findByIdAndUpdate(product_id, payload, { new: isNew });
}

module.exports = {
    getProduct,
    publishProduct,
    unPublishProduct,
    searchProduct,
    getAllProduct,
    getProductById,
    updateProductById
}