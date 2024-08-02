const express = require("express");
const Router = express.Router();
const hotel_room_amenities_controller = require('../../controllers/hotel/hotel_room_amenities_controller')

Router.post('/roomAmenities',  hotel_room_amenities_controller.addAmenity);
Router.get('/roomAmenities', hotel_room_amenities_controller.listOfAmenity);
Router.delete('/roomAmenities/:id', hotel_room_amenities_controller.deleteAmenity);

module.exports = Router