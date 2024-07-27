const express = require('express');
const QIWI = require('../../controllers/paymentGateways/QIWI');

const router = express.Router();

router.post('/QIWICreatePayment', QIWI.QIWICreatePayment);
router.get('/QIWICheckPayment/:billId', QIWI.QIWICheckPayment);
router.post('/QIWICancelPayment/:billId', QIWI.QIWICancelPayment);

module.exports = router;