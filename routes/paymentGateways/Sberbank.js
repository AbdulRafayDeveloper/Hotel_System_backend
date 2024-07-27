const express = require('express');
const Sberbank = require('../../controllers/paymentGateways/Sberbank');

const router = express.Router();

router.post('/SberbankCreatePayment', Sberbank.SberbankCreatePayment);
router.get('/SberbankCheckPayment/:orderId', Sberbank.SberbankCheckPayment);
router.post('/SberbankCancelPayment', Sberbank.SberbankCancelPayment);

module.exports = router;