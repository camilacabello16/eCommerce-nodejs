'use strict'

const { BadRequestError } = require("../core/error.response");
const { findCartActive } = require("../models/repositories/cart.repo");
const { getAvailableProduct } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
    /*
    shopOrderIds: [
        {
            shopId,
            shop_discount: [
                {
                    shopId,
                    discountCode
                }
            ],
            item_products: [
                {
                    price,
                    quantity,
                    productId
                }
            ]
        }
    ]
    */
    static async checkoutReview({ cartId, userId, shopOrderIds }) {
        const foundCart = await findCartActive(cartId);
        if (!foundCart) throw new BadRequestError('Cart not exist');

        const checkout_order = {
            totalPrice: 0, // tong tien
            shipFee: 0, // phi van chuyen
            totalDiscount: 0, // tien discount
            totalCheckout: 0 // tien thanh toan
        }, shop_order_checkout = [];

        for (let i = 0; i < shopOrderIds.length; i++) {
            const { shopId, shop_discounts = [], item_products } = shopOrderIds[i];

            //check product available
            const checkProduct = await getAvailableProduct(item_products);

            const checkoutPrice = checkProduct.reduce((acc, product) => {
                return acc + (product.quantity * product.price);
            }, 0);

            checkout_order.totalPrice += checkoutPrice;

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, //trc khi discount
                priceApplyDiscount: checkoutPrice,
                item_products: checkProduct
            };

            if (shop_discounts.length > 0) {
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    discountCode: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProduct
                });

                checkout_order.totalDiscount += discount;

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }
            }

            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_checkout.push(itemCheckout);
        }

        return {
            shopOrderIds,
            shop_order_checkout,
            checkout_order
        }
    }
}

module.exports = CheckoutService;