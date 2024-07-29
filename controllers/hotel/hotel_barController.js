const express = require('express');
const Router = express.Router();
const hotel_bar = require('../../models/hotels/hotel_bar');

Router.addHotelBar = async (req, res) => {
    try {
        if (!req.body.label) {
            return res.status(400).json({ error: 'Label is required' });
        }

        const { label } = req.body;
        const existingLabel = await hotel_bar.findOne({ label });

        if (existingLabel) {
            return res.status(409).json({ status: 409, message: 'This Hotel Bar exists' });
        }

        const data = new hotel_bar({ label });
        await data.save();

        res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
        console.log("error in catch block: ", error);
        res.status(500).json({ error: 'Internel Server Error' });
    }
};

Router.listOfHotelBar = async (req, res) => {
    try {
        const data = await hotel_bar.find();
        res.status(200).json(data);
    } catch (error) {
        console.log("error in catch block: ", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

Router.deleteHotelBar = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await hotel_bar.findById(id);
        
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const result = await hotel_bar.findByIdAndDelete(id);

        if (result) {
            return res.status(200).json({ status: 200, message: 'Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.log("error in catch block: ", error);
        res.status(500).json({ error: 'Failed to delete.' });
    }
};

module.exports = Router;