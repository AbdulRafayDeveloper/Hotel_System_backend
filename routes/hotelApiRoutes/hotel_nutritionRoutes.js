const express = require('express');
const hotel_nutritionController = require('../../controllers/hotel/hotel_nutritionController');

const router = express.Router();

router.post('/hotelNutrition', hotel_nutritionController.addHotelNutrition);
router.get('/hotelNutrition', hotel_nutritionController.listOfHotelNutrition);
router.delete('/hotelNutrition/:id', hotel_nutritionController.deleteHotelNutrition);

module.exports = router;