const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beautyAndHealthSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("beauty_and_health", beautyAndHealthSchema);