const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelTransferServicesSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("hotelTransferServices", hotelTransferServicesSchema);