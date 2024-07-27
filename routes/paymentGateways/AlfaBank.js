const express = require('express');
const AlfaBank = require('../../controllers/paymentGateways/AlfaBank');

const router = express.Router();

router.post('/AlfaBankCreatePayment', AlfaBank.AlfaBankCreatePayment);
router.get('/AlfaBankCheckPayment/:orderId', AlfaBank.AlfaBankCheckPayment);
router.post('/AlfaBankCancelPayment', AlfaBank.AlfaBankCancelPayment);
router.post('/AlfaBankPaymentStatusVerify', AlfaBank.AlfaBankPaymentStatusVerify);

module.exports = router;