const express = require('express');
const Router = express.Router();
const hotel_nutrition = require('../../models/hotels/hotel_nutrition');

Router.addHotelNutrition = async (req, res) => {
    try {
        // Check if req.body.label exists and is not empty
        if (!req.body.label || req.body.label.trim() === '') {
            return res.status(400).json({ error: 'Label is required' });
        }

        const { label } = req.body;

        // Check if the label already exists
        const existingLabel = await hotel_nutrition.findOne({ label });
        if (existingLabel) {
            return res.status(409).json({ status: 409, message: 'This Hotel Nutrition already exists' });
        }

        // Create a new instance of Hotel_Types with label
        const data = new hotel_nutrition({ label });
        await data.save();

        res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internel Server Error' });
    }
};

// GET /hotelTypes - Get all hotel types
Router.listOfHotelNutrition = async (req, res) => {
    try {
        // Fetch all hotel types from the database
        const data = await hotel_nutrition.find();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

Router.deleteHotelNutrition = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the hotel type exists
        console.log("Delete Id: ", id);
        const data = await hotel_nutrition.findById(id);
        console.log("data: ", data);
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        // Delete the hotel type from the database
        const result = await hotel_nutrition.findByIdAndDelete(id);
        if (result) {
            return res.status(200).json({ status:200, message: 'Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to delete.' });
    }
};

module.exports = Router;