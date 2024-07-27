const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name: { type: String, required: true },
    createdAt: Date,
});

module.exports = mongoose.model("roles", roleSchema);