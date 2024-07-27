const express = require('express');
const hotel_transport = require('../../controllers/hotel/hotel_transport');

const router = express.Router();

router.post('/hotel_transport', hotel_transport.add);
router.get('/hotel_transport', hotel_transport.view);
router.delete('/hotel_transport/:id', hotel_transport.delete);

module.exports = router;