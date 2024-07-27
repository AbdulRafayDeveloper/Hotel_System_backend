const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conferenceFacilitiesSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("conference_facilities", conferenceFacilitiesSchema);