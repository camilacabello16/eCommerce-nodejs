'use strict'

const { Ok } = require("../core/success.response");

class CheckoutController {
    checkoutReview = async (req, res) => {
        new Ok({
            message: 'checkoutReview Success!',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res);
    }
}

module.exports = new CheckoutController();