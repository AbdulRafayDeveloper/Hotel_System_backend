const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QaasTypeSchema = new Schema({
	question: { type: String, required: true },
	answer: { type: String, required: true }
})

module.exports = mongoose.model("qaas", QaasTypeSchema);