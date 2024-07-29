const express = require('express');
const Router = express.Router();
const hotel_transport = require('../../models/hotels/hotel_transport');

Router.add = async (req, res) => {
    try {
        if (!req.body.label) {
            return res.status(400).json({ error: 'Label is required' });
        }

        const { label } = req.body;
        const existingLabel = await hotel_transport.findOne({ label });

        if (existingLabel) {
            return res.status(409).json({ status: 409, message: 'This record already exist in Database' });
        }

        const data = new hotel_transport({ label });
        await data.save();

        res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internel Server Error' });
    }
};

Router.view = async (req, res) => {
    try {
        const data = await hotel_transport.find();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

Router.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await hotel_transport.findById(id);
        
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const result = await hotel_transport.findByIdAndDelete(id);
        
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