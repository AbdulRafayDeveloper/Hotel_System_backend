const express = require('express');
const Router = express.Router();
const accessibleEnvironments = require('../../models/hotels/accessibleEnvironments');

Router.add = async (req, res) => {
    try {
        console.log("1", req.body);
        if (!req.body.label) {
            return res.status(400).json({ error: 'Label is required' });
        }

        const { label } = req.body;
        console.log("label: ", label);

        const existingLabel = await accessibleEnvironments.findOne({ label });
        if (existingLabel) {
            return res.status(409).json({ status: 409, message: 'This record already exist in Database' });
        }

        const data = new accessibleEnvironments({ label });
        await data.save();

        res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internel Server Error' });
    }
};

Router.view = async (req, res) => {
    try {
        // Fetch all hotel types from the database
        const data = await accessibleEnvironments.find();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

Router.delete = async (req, res) => {
    const { id } = req.params;

    try {
        console.log("Delete Id: ", id);
        const data = await accessibleEnvironments.findById(id);
        console.log("data: ", data);
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const result = await accessibleEnvironments.findByIdAndDelete(id);
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