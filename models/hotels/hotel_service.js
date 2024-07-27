const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelServiceSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("hotelService", hotelServiceSchema);