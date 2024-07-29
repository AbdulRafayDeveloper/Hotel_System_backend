const express = require('express');
const Router = express.Router();
const mongoose = require("mongoose");
const hotelTypes = require('../../models/hotels/Hotel_Types');
const Hotel = require('../../models/hotels/Hotels');
const fs = require('fs');
const path = require('path');
const withPrefix = require('../../helper/withPrefix');

Router.uploadThumbnail = async (req, res) => {
    try {
        if (!req.file || !req.file.filename) {
            return res.status(400).json({ error: 'Image file not provided' });
        }
        const thumb = `/thumbnails/rooms/${req.file.filename}`;
        res.status(201).json({ message: 'Hotel Type added successfully', thumbURL: `${withPrefix(req)}${thumb}` });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred in uploading the image' });
    }
}

Router.removeThumbnail = async (req, res) => {
    if (!req.params.filename) {
        return res.status(400).json({ error: 'Image filename not provided' });
    }
    const filePath = path.join(__dirname, `../../public/thumbnails/rooms/${req.params.filename}`)
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'file remove failed' })
        } else {
            res.status(200).json({ message: 'file removed' })
        }
    });
}

module.exports = Router