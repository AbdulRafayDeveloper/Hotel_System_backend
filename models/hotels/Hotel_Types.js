const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelTypeSchema = new Schema({
    thumb: { type: String },
    label: { type: String, required: true },
});

module.exports = mongoose.model("hoteltypes", hotelTypeSchema);