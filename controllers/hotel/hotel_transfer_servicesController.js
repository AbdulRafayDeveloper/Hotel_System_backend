const express = require('express');
const Router = express.Router();
const hotel_transfer_services = require('../../models/hotels/hotel_transfer_services');

Router.addhotelTransferServices = async (req, res) => {
    try {
        console.log("Label: ", req.body.label);
        // Check if req.body.label exists and is not empty
        if (!req.body.label || req.body.label.trim() === '') {
            return res.status(400).json({ error: 'Label is required' });
        }

        const { label } = req.body;

        // Check if the label already exists
        const existingLabel = await hotel_transfer_services.findOne({ label });
        if (existingLabel) {
            return res.status(409).json({ status: 409, message: 'This Hotel transfer Service already exists' });
        }

        // Create a new instance of Hotel_Types with label
        const hotel_transfer_services_data = new hotel_transfer_services({ label });
        await hotel_transfer_services_data.save();

        res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internel Server Error' });
    }
};

// GET /hotelTypes - Get all hotel types
Router.listOfHotelTransferServices = async (req, res) => {
    try {
        // Fetch all hotel types from the database
        const hotel_transfer_services_data = await hotel_transfer_services.find();
        res.status(200).json(hotel_transfer_services_data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

Router.deleteHotelTransferServices = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the hotel type exists
        console.log("Delete Id: ", id);
        const hotel_transfer_services_data = await hotel_transfer_services.findById(id);
        console.log("hotel_transfer_services_data: ", hotel_transfer_services_data);
        if (!hotel_transfer_services_data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        // Delete the hotel type from the database
        const result = await hotel_transfer_services.findByIdAndDelete(id);
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