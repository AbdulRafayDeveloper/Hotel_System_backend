const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelInfrastructureSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("hotelInfrastructure", hotelInfrastructureSchema);