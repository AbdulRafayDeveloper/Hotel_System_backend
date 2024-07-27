const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const entertainmentAndSportsSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("entertainment_and_sports", entertainmentAndSportsSchema);