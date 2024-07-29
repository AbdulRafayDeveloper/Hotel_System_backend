const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelServiceSchema = new Schema({
    label: { type: String, required: true },
    icon: { type: String, required: true }
});

module.exports = mongoose.model("hotelService", hotelServiceSchema);