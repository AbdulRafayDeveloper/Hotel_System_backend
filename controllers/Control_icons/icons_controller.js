const express = require('express');
const Router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const { successResponse, serverErrorResponse } = require('../../helper/successResponse');
const Icons = require('../../models/Model_icons/icons')
const withPrefix = require('../../helper/withPrefix');

Router.addIcon = async (req, res) =>{
    try {
    
        if (!req.file || !req.file.filename) { 
            return res.status(400).json({ error: 'Icon file not provided' });
        }
        
        const icon = `/thumbnails/icons/${req.file.filename}`; 
        
        const categoriesTypes = new Icons({ ...req.body, icon });
        await categoriesTypes.save();
        
        res.status(200).json({ message: 'Icons added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'An error occurred in uploading the image' });
    }
}

Router.getIcons = async (req, res) => {
    try {
        // Fetch icons from the database
        let icons = Icons.find();
        
        // Optionally select specific fields if provided in query
        if (req.query?.fields) {
            icons = await icons.select(req.query.fields);
        } else {
            icons = await icons.select();
        }

        // Map icons to add a prefix to the thumbnail URL if needed
        const dataWithHostPrefixedIcons = icons.map(icon => ({
            ...icon.toObject(),
            icon: `${withPrefix(req)}${icon.icon}` // Assuming `withPrefix` is a function to add host prefix
        }));

        // Send successful response with the data
        res.status(200).json(dataWithHostPrefixedIcons);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: 'An error occurred while fetching the icons'
        });
    }
};


Router.deleteIcon = async(req,res) =>{
    try {
        const { id } = req.params;
        const icon = await Icons.findById(id);

        console.log('icon id:',icon)
        if (!icon) {
            return res.status(404).json({ error: 'Icon not found' });
        }

        // Get the thumb path
        const thumbPath = icon.icon;
        console.log('icon path:',thumbPath)

        // Delete the file from the folder
        if (thumbPath) {
            const absolutePath = path.join(__dirname, '../../public', thumbPath);

            console.log('absolute path:',absolutePath)

            fs.unlink(absolutePath, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete associated file' });
                }

                // Verify the file has been deleted
                fs.access(absolutePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log("File successfully deleted from the folder");
                    } else {
                        console.log("File still exists in the folder");
                    }
                });
            });
        }

        const result = await Icons.findByIdAndDelete(id);
        if (result) {
            return res.status(200).json({ status: 200, message: 'Icon deleted successfully' });
        } else {
            res.status(404).json({ error: 'Icon not found' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to delete Icon' });
    }
}

module.exports = Router;