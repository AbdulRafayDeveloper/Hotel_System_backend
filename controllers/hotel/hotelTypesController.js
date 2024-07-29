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

        const hotelTypes = new Hotel_Types({ ...req.body, thumb });
        await hotelTypes.save();

        res.status(201).json({ message: 'Hotel Type added successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred in uploading the image' });
    }
};

Router.listOfHotelsTypes = async (req, res) => {
    try {
        let hotelTypes = Hotel_Types.find()
        // Fetch all hotel types from the database
        if (req.query?.fields) { hotelTypes = await hotelTypes.select(req.query.fields); }
        else hotelTypes = await hotelTypes.select()
        const dataWithHostPrefixedThumbnail = hotelTypes.map(type => ({
            ...type.toObject(),
            thumb: `${withPrefix(req)}${type.thumb}`
        }));

        res.status(200).json(dataWithHostPrefixedThumbnail);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch hotel types' });
    }
};

Router.deleteHotelTypes = async (req, res) => {
    try {
        const { id } = req.params;
        const hotelType = await Hotel_Types.findById(id);

        if (!hotelType) {
            return res.status(404).json({ error: 'Hotel type not found' });
        }

        // Get the thumb path
        const thumbPath = hotelType.thumb;

        // Delete the file from the folder
        if (thumbPath) {
            const absolutePath = path.join(__dirname, '../public', thumbPath);

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