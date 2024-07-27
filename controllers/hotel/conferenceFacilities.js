const express = require('express');
const Router = express.Router();
const conferenceFacilities = require('../../models/hotels/conferenceFacilities');

Router.add = async (req, res) => {
    try {
        console.log("1", req.body);
        if (!req.body.label) {
            return res.status(400).json({ error: 'Label is required' });
        }

        const { label } = req.body;
        console.log("label: ", label);

        const existingLabel = await conferenceFacilities.findOne({ label });
        if (existingLabel) {
            return res.status(409).json({ status: 409, message: 'This record already exist in Database' });
        }

        const data = new conferenceFacilities({ label });
        await data.save();

        res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internel Server Error' });
    }
};

Router.view = async (req, res) => {
    try {
        const data = await conferenceFacilities.find();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

Router.delete = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Delete Id: ", id);
        const data = await conferenceFacilities.findById(id);
        console.log("data: ", data);
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const result = await conferenceFacilities.findByIdAndDelete(id);
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