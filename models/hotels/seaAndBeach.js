const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const seaAndBeachSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("sea_and_beach", seaAndBeachSchema);