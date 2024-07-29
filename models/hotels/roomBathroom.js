const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomBathroomSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("room_bathrooms", roomBathroomSchema);