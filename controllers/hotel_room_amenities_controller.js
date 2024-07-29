const express = require('express');
const Router = express.Router();
const Hotel_room_amenities = require('../models/Hotel_room_amenities');

Router.addAmenity = async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ message: "Error: Icon is required" })
		const { label } = req.body
		if (!label) return res.status(400).json({ message: "Error: Label is required" })
		const amenity = new Hotel_room_amenities({ icon: `/thumbnails/room_amenities/${req.file.filename}`, label })
		await amenity.save();
		return res.status(200).json({ message: 'success' })
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" })
	}
}

module.exports = Router