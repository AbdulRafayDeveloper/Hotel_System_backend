const express = require('express');
const Router = express.Router();
const Roles = require('../../models/roles/role');

Router.addRole = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const { name } = req.body;
        const existingRole = await Roles.findOne({ name });

        if (existingRole) {
            return res.status(409).json({ status: 409, message: 'This Role Already exists' });
        }

        const data = new Roles({ name });
        await data.save();

        res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internel Server Error' });
    }
};

Router.listOfRoles = async (req, res) => {
    try {
        const data = await Roles.find();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

Router.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Roles.findById(id);

        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const result = await Roles.findByIdAndDelete(id);

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