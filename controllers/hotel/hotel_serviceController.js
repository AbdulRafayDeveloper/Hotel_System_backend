const express = require('express');
const Router = express.Router();
const hotel_service = require('../../models/hotels/hotel_service');

Router.addHotelService = async (req, res) => {
    try {
        if (!req.body.label || req.body.label.trim() === '') {
            return res.status(400).json({ error: 'Label is required' });
        }
        if (!req.file.filename) return res.status(400).json({ error: 'Icon is required' })

        const { label } = req.body;
        const icon = `/thumbnails/hotelservice/${req.file.filename}`;
        // Check if the label already exists
        const existingLabel = await hotel_service.findOne({ label });

        if (existingLabel) {
            return res.status(409).json({ status: 409, message: 'This Hotel Service already exists' });
        }

        // Create a new instance of Hotel_Types with label
        const data = new hotel_service({ label, icon });
        await data.save();

        res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internel Server Error' });
    }
};

Router.listOfHotelService = async (req, res) => {
    try {
        const data = await hotel_service.find();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

Router.deleteHotelService = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await hotel_service.findById(id);

        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const result = await hotel_service.findByIdAndDelete(id);

        if (result) {
            return res.status(200).json({ status: 200, message: 'Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to delete.' });
    }
};

module.exports = Router;