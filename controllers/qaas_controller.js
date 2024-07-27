const express = require("express");
const Router = express.Router()
const Qaas = require('../models/Qaas');
const { successResponse, serverErrorResponse } = require('../helper/successResponse');

Router.addQaas = async (req, res) => {
	try {
		const { question, answer } = req.body
		if (!req.body.question) return res.status(400).json({ error: "Question is required" })
		if (!req.body.answer) return res.status(400).json({ error: "Answer is required" })
		const qaas = new Qaas({ question, answer })
		await qaas.save();
		return successResponse(res)
	} catch (error) {
		return serverErrorResponse(res)
	}
}

Router.listQaas = async (req, res) => {
	try {
		const qaas = await Qaas.find();
		return res.json({ status: 200, data: qaas });
	} catch (error) {
		return serverErrorResponse(res)
	}
}
module.exports = Router;