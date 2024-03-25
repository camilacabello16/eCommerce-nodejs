'use strict'

const { BadRequestError } = require("../core/error.response");
const { product, clothing } = require("../models/product.model");
const { getProduct, publishProduct, unPublishProduct, searchProduct, getAllProduct, getProductById } = require("../models/repositories/product.repo");

class ProductFactory {
    static productRegistry = {}; //key - class

    static registerProduct = (type, classRef) => {
        this.productRegistry[type] = classRef;
    }

    static createProduct = async (type, payload) => {
        const productClass = this.productRegistry[type];
        if (!productClass) throw new BadRequestError('Invalid Type ' + type);

        return new productClass(payload).createProduct();
    }

    static getProductDraftByShop = async ({ product_shop, limit = 50, skip = 0 }) => {
        const query = { product_shop, isDraft: true };
        return await getProduct({ query, skip, limit });
    }

    static getProductPublishByShop = async ({ product_shop, limit = 50, skip = 0 }) => {
        const query = { product_shop, isPublished: true };
        return await getProduct({ query, skip, limit });
    }

    static publishProduct = async ({ product_id }) => {
        return await publishProduct({ product_id });
    }

    static unPublishProduct = async ({ product_id }) => {
        return await unPublishProduct({ product_id });
    }

    static searchProduct = async ({ keyword }) => {
        return await searchProduct({ keyword });
    }

    static getAllProduct = async ({ skip = 1, limit = 50, sort = 'ctime', filter = { isPublished: true } }) => {
        return await getAllProduct({ skip, limit, sort, filter, select: ['product_name', 'product_price', 'product_thumb'] });
    }

    static getProductById = async ({ product_id }) => {
        return await getProductById({ product_id, unSelect: ['createdAt'] });
    }
}

class Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        console.log(this);
    }
    async createProduct() {
        return await product.create({ ...this, _id: product._id });
    }
}

class Clothing extends Product {
    async createProduct() {
        const newDetail = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newDetail) throw new BadRequestError('Create Error');

        const newProduct = super.createProduct({ ...this, _id: newDetail._id });
        if (!newProduct) throw new BadRequestError('Create Error');

        return newProduct;
    }
}

ProductFactory.registerProduct('Clothing', Clothing);

module.exports = ProductFactory;