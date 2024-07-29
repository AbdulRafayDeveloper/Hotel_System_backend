const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomEntertainmentsSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("room_entertainments", roomEntertainmentsSchema);