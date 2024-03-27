'use strict'

const { Ok, Created } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
    createDiscount = async (req, res) => {
        req.body.shop_id = req.user.userId;
        new Created({
            message: 'Create Discount Success!',
            metadata: await DiscountService.createDiscount(req.body)
        }).send(res);
    }

    getProductInDiscount = async (req, res) => {
        console.log(req.query);
        new Ok({
            message: 'getProductInDiscount Success!',
            metadata: await DiscountService.getProductInDiscount(req.query)
        }).send(res);
    }

    getDiscountByShop = async (req, res) => {
        console.log(req.query);
        new Ok({
            message: 'getDiscountByShop Success!',
            metadata: await DiscountService.getDiscountByShop(req.query)
        }).send(res);
    }

    getDiscountAmount = async (req, res) => {
        new Ok({
            message: 'getDiscountAmount Success!',
            metadata: await DiscountService.getDiscountAmount(req.body)
        }).send(res);
    }

    deleteDiscount = async (req, res) => {
        new Ok({
            message: 'deleteDiscount Success!',
            metadata: await DiscountService.deleteDiscount({ code: req.params.code })
        }).send(res);
    }

    cancelDiscountByUser = async (req, res) => {
        new Ok({
            message: 'cancelDiscountByUser Success!',
            metadata: await DiscountService.cancelDiscountByUser(req.body)
        }).send(res);
    }
}

module.exports = new DiscountController();