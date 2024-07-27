const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const excursionKeypointSchema = new Schema({
    color: { type: String, required: true },
    label: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("ExcursionKeypoint", excursionKeypointSchema);