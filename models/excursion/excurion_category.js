const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const excursionCategorySchema = new Schema({
    icon: { type: String, required: true },
    label: { type: String, required: true }
});

module.exports = mongoose.model("ExcursionCategory", excursionCategorySchema);