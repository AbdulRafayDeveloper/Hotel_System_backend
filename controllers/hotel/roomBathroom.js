const express = require('express');
const Router = express.Router();
const roomBathrooms = require('../../models/hotels/roomBathroom');

Router.add = async (req, res) => {
    try {
        if (!req.body.label) {
            return res.status(400).json({ error: 'Label is required' });
        }

        const { label } = req.body;
        const existingLabel = await roomBathrooms.findOne({ label });

        if (existingLabel) {
            return res.status(409).json({ status: 409, message: 'This record already exist in Database' });
        }

        const data = new roomBathrooms({ label });
        await data.save();

        res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internel Server Error' });
    }
};

Router.view = async (req, res) => {
    try {
        const data = await roomBathrooms.find();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

Router.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await roomBathrooms.findById(id);

        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const result = await roomBathrooms.findByIdAndDelete(id);

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