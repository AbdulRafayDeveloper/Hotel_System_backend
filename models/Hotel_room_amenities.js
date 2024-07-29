const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const amenitySchema = new Schema({
	icon: String,
	label: String
});
module.exports = mongoose.model('hotel_room_amenities', amenitySchema);