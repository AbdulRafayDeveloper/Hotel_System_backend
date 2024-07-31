const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const iconSchema = new Schema({
    icon: { type: String, required: true },
});

module.exports = mongoose.model("icons", iconSchema);