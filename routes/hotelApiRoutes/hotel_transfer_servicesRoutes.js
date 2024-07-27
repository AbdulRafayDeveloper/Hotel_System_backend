const express = require('express');
const hotel_transfer_servicesController = require('../../controllers/hotel/hotel_transfer_servicesController');

const router = express.Router();

router.post('/HotelTransferServices', hotel_transfer_servicesController.addhotelTransferServices);
router.get('/HotelTransferServices', hotel_transfer_servicesController.listOfHotelTransferServices);
router.delete('/HotelTransferServices/:id', hotel_transfer_servicesController.deleteHotelTransferServices);

module.exports = router;