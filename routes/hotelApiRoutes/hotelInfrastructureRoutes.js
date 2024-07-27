const express = require('express');
const hotel_infrastructureController = require('../../controllers/hotel/hotel_infrastructureController');

const router = express.Router();

router.post('/hotelInfrastructure', hotel_infrastructureController.addHotelInfrastructure);
router.get('/hotelInfrastructure', hotel_infrastructureController.listOfHotelInfrastructure);
router.delete('/hotelInfrastructure/:id', hotel_infrastructureController.deleteHotelInfrastructure);

module.exports = router;