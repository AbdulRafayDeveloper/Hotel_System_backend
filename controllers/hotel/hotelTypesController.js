const express = require('express');
const Router = express.Router();
const Hotel_Types = require('../../models/hotels/Hotel_Types');
const withPrefix = require('../../helper/withPrefix');
const fs = require('fs');
const path = require('path');

Router.addHotelTypes = async (req, res) => {

    try {

        if (!req.file || !req.file.filename) {
            return res.status(400).json({ error: 'Image file not provided' });
        }
        if (!req.body.label || req.body.label.trim() === '') {
            return res.status(400).json({ error: 'Label is required' });
        }

        const thumb = `/thumbnails/hotel_type/${req.file.filename}`;

        // Create a new instance of Hotel_Types with label and thumb
        const hotelTypes = new Hotel_Types({ ...req.body, thumb });
        await hotelTypes.save();

        res.status(201).json({ message: 'Hotel Type added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred in uploading the image' });
    }
};

// GET /hotelTypes - Get all hotel types
Router.listOfHotelsTypes = async (req, res) => {
    try {
        // Fetch all hotel types from the database
        const hotelTypes = await Hotel_Types.find();

        // Prepend the base URL to the thumb field
        const hotelTypesWithFullUrl = hotelTypes.map(hotelType => {
            const hotelTypeObj = hotelType.toObject();
            hotelTypeObj.thumb = `${withPrefix(req)}/${hotelType.thumb}`
            return hotelTypeObj;
        });

        res.status(200).json(hotelTypesWithFullUrl);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch hotel types' });
    }
};

Router.deleteHotelTypes = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the hotel type exists
        console.log("Delete Id: ", id);
        const hotelType = await Hotel_Types.findById(id);
        console.log("hotelType: ", hotelType);
        if (!hotelType) {
            return res.status(404).json({ error: 'Hotel type not found' });
        }

        // Get the thumb path
        const thumbPath = hotelType.thumb;

        console.log("thumbPath: ", thumbPath);

        // Delete the file from the folder
        if (thumbPath) {
            const absolutePath = path.join(__dirname, '../public', thumbPath);
            console.log("absolutePath: ", absolutePath);

            fs.unlink(absolutePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                    return res.status(500).json({ error: 'Failed to delete associated file' });
                } else {
                    console.log("File deleted successfully:", absolutePath);
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

        // Delete the hotel type from the database
        const result = await Hotel_Types.findByIdAndDelete(id);
        if (result) {
            return res.status(200).json({ status: 200, message: 'Hotel type deleted successfully' });
        } else {
            res.status(404).json({ error: 'Hotel type not found' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to delete hotel type' });
    }
};

module.exports = Router;