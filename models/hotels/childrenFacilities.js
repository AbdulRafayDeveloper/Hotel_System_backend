const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const childrenFacilitiesSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("children_facilities", childrenFacilitiesSchema);