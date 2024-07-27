const express = require('express');
const hotel_barController = require('../../controllers/hotel/hotel_barController');

const router = express.Router();

router.post('/hotelBar', hotel_barController.addHotelBar);
router.get('/hotelBar', hotel_barController.listOfHotelBar);
router.delete('/hotelBar/:id', hotel_barController.deleteHotelBar);

module.exports = router;