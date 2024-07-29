const express = require('express');
const Router = express.Router();
const hotel_infrastructure = require('../../models/hotels/hotel_infrastructure');

Router.addHotelInfrastructure = async (req, res) => {
    try {
        if (!req.body.label || req.body.label.trim() === '') {
            return res.status(400).json({ error: 'Label is required' });
        }

        const { label } = req.body;
        const existingLabel = await hotel_infrastructure.findOne({ label });

        if (existingLabel) {
            return res.status(409).json({ status: 409, message: 'This Hotel Infrastructure already exists' });
        }

        const data = new hotel_infrastructure({ label });
        await data.save();

        res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internel Server Error' });
    }
};

Router.listOfHotelInfrastructure = async (req, res) => {
    try {
        const data = await hotel_infrastructure.find();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

Router.deleteHotelInfrastructure = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await hotel_infrastructure.findById(id);

        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const result = await hotel_infrastructure.findByIdAndDelete(id);

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