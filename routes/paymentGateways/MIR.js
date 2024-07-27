const express = require('express');
const MIR = require('../../controllers/paymentGateways/MIR');

const router = express.Router();

router.post('/MIRCreatePayment', MIR.MIRCreatePayment);
router.post('/MIRVerifyPayment', MIR.MIRVerifyPayment);

module.exports = router;