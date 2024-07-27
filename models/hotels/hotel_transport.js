const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelTransportSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("hotel_transport", hotelTransportSchema);