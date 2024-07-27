const express = require('express');
const hotel_serviceController = require('../../controllers/hotel/hotel_serviceController');

const router = express.Router();

router.post('/hotelService', hotel_serviceController.addHotelService);
router.get('/hotelService', hotel_serviceController.listOfHotelService);
router.delete('/hotelService/:id', hotel_serviceController.deleteHotelService);

module.exports = router;