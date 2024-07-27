const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelBarSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("hotelBar", hotelBarSchema);