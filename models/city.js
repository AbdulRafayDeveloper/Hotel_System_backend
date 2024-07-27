const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const citySchema = new Schema({
    cityName: { type: String, required: true },
    thumbnail: { type: String, required: true },
    country: { type: String, required: true },
    createdAt: Date,
    region: { type: String, required: true },
    subdomain: { type: String, required: true },
});

module.exports = mongoose.model("city", citySchema);