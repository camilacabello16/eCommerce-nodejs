'use strict'

const { Types } = require("mongoose");
const { BadRequestError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { findDiscount, getActiveDiscount } = require("../models/repositories/discount.repo");
const { getAllProduct } = require("../models/repositories/product.repo");

class DiscountService {
    static createDiscount = async (payload) => {
        const { name, description, type, code, start_date, end_date, maximum,
            max_per_user, min_order_price, shop_id, apply_to,
            product_ids, discount_value } = payload;

        if (new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount had expired!');
        }

        if (new Date(start_date) > new Date(end_date)) {
            throw new BadRequestError('Start date must be less than end date!');
        }

        //find discount exist
        const existDiscount = await discountModel.findOne({
            discount_code: code,
            discount_is_active: true,
            discount_shop_id: shop_id
        });

        if (existDiscount) {
            throw new BadRequestError('Discount is existed!');
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_maximum: maximum,
            discount_used_quantity: 0,
            discount_user_used: [],
            discount_max_per_user: max_per_user,
            discount_min_order_price: min_order_price,
            discount_shop_id: shop_id,
            discount_is_active: true,
            discount_apply_to: apply_to,
            discount_product_ids: product_ids,
            discount_value
        });

        return newDiscount;
    }

    //get product in discount
    static getProductInDiscount = async ({ code, shopId, userId, limit, page }) => {
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_is_active: true,
            discount_shop_id: shopId
        }).lean();

        if (!foundDiscount) {
            throw new BadRequestError('Discount is not existed!');
        }
        let products;
        if (foundDiscount.discount_apply_to == "all") {
            products = await getAllProduct({
                skip: page,
                limit: limit,
                sort: 'ctime',
                filter: {
                    product_shop: shopId,
                    isPublished: true
                },
                select: ['product_name', 'product_thumb', 'product_description', 'product_price']
            })
        } else if (foundDiscount.discount_apply_to == "specific") {
            products = await getAllProduct({
                skip: page,
                limit: limit,
                sort: 'ctime',
                filter: {
                    _id: { $in: foundDiscount.discount_product_ids },
                    isPublished: true
                },
                select: ['product_name', 'product_thumb', 'product_description', 'product_price']
            })
        }

        return products;
    }

    //get all discount of shop
    static getDiscountByShop = async ({ limit, page, shopId }) => {
        const discounts = await findDiscount({
            limit: limit,
            page: page,
            sort: 'ctime',
            filter: {
                discount_shop_id: shopId,
                discount_is_active: true
            },
            select: ['discount_name', 'discount_code']
        });

        return discounts;
    }

    static getDiscountAmount = async ({ discountCode, userId, shopId, products }) => {
        const foundDiscount = await getActiveDiscount({
            filter: {
                discount_code: discountCode,
                discount_is_active: true,
                discount_shop_id: shopId
            }
        });

        if (!foundDiscount) throw new BadRequestError('Discount is not existed!');

        if (!foundDiscount.discount_maximum) throw new BadRequestError('Run out of discount!');
        if (new Date() > new Date(foundDiscount.discount_end_date)) throw new BadRequestError('Discount is expired!');

        let totalOrder = 0;
        if (foundDiscount.discount_min_order_price > 0) {
            totalOrder = products.reduce(
                (accumulator, currentValue) => accumulator + currentValue.quantity * currentValue.price,
                0,
            );

            if (totalOrder < foundDiscount.discount_min_order_price) throw new BadRequestError('Discount require min value!');
        }

        if (foundDiscount.discount_max_per_user > 0) {
            const countByUser = foundDiscount.discount_user_used.filter(o => o == userId).length;

            if (countByUser >= foundDiscount.discount_max_per_user)
                throw new BadRequestError('User use more than limit of discount!');
        }

        const amountDiscount = foundDiscount.discount_type == 'fixed_amount' ? foundDiscount.discount_value : totalOrder * (foundDiscount.discount_value / 100);

        return {
            totalOrder,
            discount: amountDiscount,
            finalPrice: totalOrder - amountDiscount
        }
    }

    static deleteDiscount = async ({ code }) => {
        return deleted = await discountModel.findOneAndDelete({
            discount_code: code
        });
    }

    static cancelDiscountByUser = async ({ discountCode, shopId, userId }) => {
        const foundDiscount = await getActiveDiscount({
            filter: {
                discount_code: discountCode,
                discount_is_active: true,
                discount_shop_id: shopId
            }
        });

        if (!foundDiscount) throw new BadRequestError('Discount is not existed!');

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_user_used: userId
            },
            $inc: {
                discount_maximum: 1,
                discount_used_quantity: -1
            }
        });

        return result;
    }
}

module.exports = DiscountService;