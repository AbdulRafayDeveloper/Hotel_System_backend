const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelNutritionSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("hotelNutrition", hotelNutritionSchema);