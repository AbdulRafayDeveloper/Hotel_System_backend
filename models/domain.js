const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const domainSchema = new Schema({
    key: { type: String, required: true },
    domain: { type: String, required: true }
});

module.exports = mongoose.model("domain", domainSchema);