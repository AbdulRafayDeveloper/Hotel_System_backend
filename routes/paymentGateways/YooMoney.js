const express = require('express');
const YooMoney = require('../../controllers/paymentGateways/YooMoney');

const router = express.Router();

router.post('/yoyoMoneyCreatePayment', YooMoney.yoyoMoneyCreatePayment);
router.post('/yoyoMoneyPaymentCallback', YooMoney.yoyoMoneyPaymentCallback);

module.exports = router;