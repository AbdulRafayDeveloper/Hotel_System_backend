const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accessibleEnvironmentsSchema = new Schema({
    label: { type: String },
});

module.exports = mongoose.model("accessible_environments", accessibleEnvironmentsSchema);