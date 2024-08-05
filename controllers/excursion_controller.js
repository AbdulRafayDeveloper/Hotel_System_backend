const express = require('express');
const Router = express.Router();
const ExcursionCategory = require('../models/excursion/excurion_category');
const ExcursionKeypoint = require('../models/excursion/excursion_keypoint');
const Excursion = require('../models/excursion/excursion');
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const { successResponse, serverErrorResponse } = require('../helper/successResponse');
const withPrefix = require('../helper/withPrefix')

// Categories

Router.addCategory = async (req, res) => {
    try {
        if (!req.body.label) {
            return res.status(400).json({ error: 'Label is required' });
        }
        if (!req.body.icon) {
            return res.status(400).json({ error: 'icon is required' });
        }
        const existingLabel = await ExcursionCategory.findOne({ label: req.body.label }).exec();
        if (existingLabel) {
            return res.status(409).json({ message: 'The category already exists' });
        }

        const cateogry = new ExcursionCategory({ label: req.body.label, icon: req.body.icon });
        await cateogry.save();

        return successResponse(res)
    } catch (error) {
        console.error("Error:", error);
        return serverErrorResponse(res);
    }
};

Router.listOfCategories = async (req, res) => {
    try {
        let categories = await ExcursionCategory.find().select({ label: 1, icon: 1, _id: -1 });

        const dataWithPrefixedIcons = categories.map(category => ({
            ...category.toObject(),
            icon: `${withPrefix(req)}${category.icon}`
        }));

        return res.status(200).json(dataWithPrefixedIcons);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

Router.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await ExcursionCategory.findById(id);

        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const result = await ExcursionCategory.findByIdAndDelete(id);

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

// Key Points

Router.addKeypoint = async (req, res) => {
    try {
        const { label, color } = req.body;

        if (!label) {
            return res.status(400).json({ error: 'Label is required' });
        }
        if (!color) {
            return res.status(400).json({ error: 'Color is required' });
        }

        const existingKeypoint = await ExcursionKeypoint.findOne({
            $or: [{ label }, { color }]
        });

        if (existingKeypoint) {
            if (existingKeypoint.label === label) {
                return res.status(400).json({ message: 'Label already exists' });
            }
            if (existingKeypoint.color === color) {
                return res.status(400).json({ message: 'Color already exists' });
            }
        }

        const keypoint = new ExcursionKeypoint({ label, color });
        await keypoint.save();

        return res.json({ status: 200, message: "Data saved successfully", data: keypoint });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

Router.listOfKeypoints = async (req, res) => {
    try {
        const keyPoints = await ExcursionKeypoint.find();
        return res.status(200).json(keyPoints);
    } catch (error) {
        console.error("Error:", error);
        return serverErrorResponse(res, error);
    }
};

Router.deleteKeypoint = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await ExcursionKeypoint.findById(id);

        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const result = await ExcursionKeypoint.findByIdAndDelete(id);

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

// Excursions

Router.addExcursion = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({ error: 'title is required' });
        }

        const excursion = new Excursion({ ...req.body });

        if (req.files.thumbs) excursion.thumbs = req.files.thumbs.map((c, i) => `/thumbnails/excursion/${c.filename}`)
        if (req.body.categories) excursion.categories = JSON.parse(req.body.categories);
        if (req.body.keyPoints) excursion.keyPoints = JSON.parse(req.body.keyPoints)

        if (req.body.program) {
            excursion.program = JSON.parse(req.body.program)
            excursion.duration = JSON.parse(req.body.program).reduce((total, c) => total + c.duration, 0)
        }

        if (req.body.goodPlaces) excursion.goodPlaces = JSON.parse(req.body.goodPlaces).map((c, i) => { return { ...c, thumb: `/thumbnails/excursion/${req.files.goodPlaceThumbs[i].filename}` } })
        if (req.body.priceDetail) excursion.priceDetail = JSON.parse(req.body.priceDetail)
        if (req.body.consider) excursion.consider = JSON.parse(req.body.consider)
        if (req.body.priceFor) excursion.priceFor = JSON.parse(req.body.priceFor)
        if (req.body.start) excursion.start = JSON.parse(req.body.start)
        if (req.body.address) excursion.address = JSON.parse(req.body.address)

        if (req.body.typeOfVisit) {
            const typeOfVisit = JSON.parse(req.body.typeOfVisit);
            typeOfVisit.maxPeople = Number(typeOfVisit.maxPeople);

            excursion.typeOfVisit = {
                typeof: typeOfVisit.typeOf, // Map to the correct key name
                maxPeople: typeOfVisit.maxPeople
            };
        }

        if (req.body.departure) excursion.departure = JSON.parse(req.body.departure);
        if (req.body.arrival) excursion.arrival = JSON.parse(req.body.arrival);
        if (req.body.description) excursion.description = JSON.parse(req.body.description);
        if (req.body.howToWork) excursion.howToWork = JSON.parse(req.body.howToWork);
        if (req.body.excursionType) excursion.excursionType = JSON.parse(req.body.excursionType);

        await excursion.save();
        return res.json({ status: 200, message: "Data saved successfully", data: excursion });
    } catch (error) {
        console.error("Error:", error);
        return serverErrorResponse(res);
    }
}

// Excursions
Router.listOfExcursions = async (req, res) => {
    try {

        // Extract filters from query parameters
        const {
            city,
            priceFrom,
            priceTo,
            withGuider,
            typeOfVisit,
            durationFrom,
            durationTo,
            excursionType
        } = req.query;

        // Build query object based on provided filters
        const query = {};
        if (city) {
            query['address.city'] = city;
        }
        if (priceFrom || priceTo) {
            query['ticketPrice'] = {};
            if (priceFrom) {
                query['ticketPrice'].$gte = parseFloat(priceFrom);
            }
            if (priceTo) {
                query['ticketPrice'].$lte = parseFloat(priceTo);
            }
        }
        if (withGuider) query['withGuider'] = withGuider;
        if (typeOfVisit) query['typeOfVisit.typeof'] = typeOfVisit;
        if (durationFrom || durationTo) {
            query['duration'] = {};
            if (durationFrom) {
                query['duration'].$gte = parseFloat(durationFrom);
            }
            if (durationTo) {
                query['duration'].$lte = parseFloat(durationTo);
            }
        }
        if (excursionType) query['excursionType'] = { $in: excursionType.split(",") }

        // Fetch excursions based on query
        const excursions = await Excursion.find(query)
            .select("title thumbs description keyPoints duration teamMaxSize withGuider withBus ticketPrice start reviews")
            .exec();
        const count = excursions.length
        return res.status(200).json({ data: excursions, count });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: 'Internel Server Error' });
    }
};

Router.getExcursion = async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "Id is required" })
        const excursion = await Excursion.findById(req.params.id)
        res.status(200).json(excursion)
    } catch (error) {
        console.error("Error: ", error)
        return serverErrorResponse(error)
    }
}

Router.getExcursion = async (req, res) => {
    try {
        console.log("1");
        const excursionId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(excursionId)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const excursion = await Excursion.findById(excursionId);
        if (!excursion) {
            return res.status(404).json({ error: 'Excursion not found' });
        }

        res.json({ status: 200, message: 'Excursion deleted successfully', data: excursion });
    } catch (error) {
        console.error("Error:", error);
        return serverErrorResponse(res, error);
    }
};

Router.updateExcursion = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("id: ", id)

        if (!id) { return res.status(400).json({ error: 'ID is required' }); }
        const excursion = await Excursion.findById(id);

        console.log("excursion: ", excursion)

        if (!excursion) { return res.status(404).json({ error: 'Not found' }); }

        // Extract image paths from the thumbs array
        const thumbsPaths = excursion.thumbs.map(img => path.join(__dirname, '../public', img));

        // Extract image paths from the thumb field within each goodPlace object
        const goodPlacesPaths = excursion.goodPlaces.map(place => path.join(__dirname, '../public', place.thumb));

        // Combine all paths
        const allImagePaths = [...thumbsPaths, ...goodPlacesPaths];

        console.log("allImagePaths: ", allImagePaths)
        // Function to delete a single image
        const deleteImage = (imagePath) => {
            return new Promise((resolve, reject) => {
                fs.unlink(imagePath, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        };

        await Promise.all(allImagePaths.map(deleteImage));
        const deletedExcursion = await Excursion.findByIdAndDelete(id);

        console.log("deletedExcursion: ", deletedExcursion)

        if (!deletedExcursion) {
            return res.status(404).json({ error: 'Excursion could not be updated' });
        }
        else {
            if (!req.body.title) { return res.status(400).json({ error: 'title is required' }); }

            const excursion = new Excursion({ ...req.body });
            console.log("excursion: ", excursion)

            if (req.files.thumbs) excursion.thumbs = req.files.thumbs.map((c, i) => `/thumbnails/excursion/${c.filename}`)
            if (req.body.categories) excursion.categories = JSON.parse(req.body.categories);
            if (req.body.keyPoints) excursion.keyPoints = JSON.parse(req.body.keyPoints)

            if (req.body.program) {
                excursion.program = JSON.parse(req.body.program)
                excursion.duration = JSON.parse(req.body.program).reduce((total, c) => total + c.duration, 0)
            }

            if (req.body.goodPlaces) excursion.goodPlaces = JSON.parse(req.body.goodPlaces).map((c, i) => { return { ...c, thumb: `/thumbnails/excursion/${req.files.goodPlaceThumbs[i].filename}` } })
            if (req.body.priceDetail) excursion.priceDetail = JSON.parse(req.body.priceDetail)
            if (req.body.consider) excursion.consider = JSON.parse(req.body.consider)
            if (req.body.priceFor) excursion.priceFor = JSON.parse(req.body.priceFor)
            if (req.body.start) excursion.start = JSON.parse(req.body.start)
            if (req.body.address) excursion.address = JSON.parse(req.body.address)

            if (req.body.typeOfVisit) {
                const typeOfVisit = JSON.parse(req.body.typeOfVisit);
                typeOfVisit.maxPeople = Number(typeOfVisit.maxPeople);

                excursion.typeOfVisit = {
                    typeof: typeOfVisit.typeOf, // Map to the correct key name
                    maxPeople: typeOfVisit.maxPeople
                };
            }

            if (req.body.departure) excursion.departure = JSON.parse(req.body.departure);
            if (req.body.arrival) excursion.arrival = JSON.parse(req.body.arrival);
            if (req.body.description) excursion.description = JSON.parse(req.body.description);
            if (req.body.howToWork) excursion.howToWork = JSON.parse(req.body.howToWork);
            if (req.body.excursionType) excursion.excursionType = JSON.parse(req.body.excursionType);

            console.log("excursion: ", excursion)
            await excursion.save();
            return res.json({ status: 200, message: "Data updated successfully", data: excursion });
        }
    } catch (error) {
        console.error("Error:", error);
        return serverErrorResponse(res);
    }
};

Router.deleteExcursion = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        const excursion = await Excursion.findById(id);

        if (!excursion) {
            return res.status(404).json({ error: 'Not found' });
        }

        // Extract image paths from the thumbs array
        const thumbsPaths = excursion.thumbs.map(img => path.join(__dirname, '../public', img));

        // Extract image paths from the thumb field within each goodPlace object
        const goodPlacesPaths = excursion.goodPlaces.map(place => path.join(__dirname, '../public', place.thumb));

        // Combine all paths
        const allImagePaths = [...thumbsPaths, ...goodPlacesPaths];

        // Function to delete a single image
        const deleteImage = (imagePath) => {
            return new Promise((resolve, reject) => {
                fs.unlink(imagePath, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        };

        await Promise.all(allImagePaths.map(deleteImage));

        // Perform deletion
        const deletedExcursion = await Excursion.findByIdAndDelete(id);

        // Check if the Excursion was deleted
        if (!deletedExcursion) {
            return res.status(404).json({ error: 'Excursion could not be deleted' });
        }

        res.status(200).json({ status: 200, message: 'Excursion deleted successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while deleting the Excursion' });
    }
};

Router.excursionsFeedBackAdd = async (req, res) => {
    try {
        const excursionId = req.params.id;
        const reviews = req.body.reviews;

        if (!Array.isArray(reviews) || !reviews.every(r =>
            typeof r.rating === 'number' &&
            typeof r.name === 'string' &&
            typeof r.createdAt === 'string' &&
            typeof r.good === 'string' &&
            typeof r.bad === 'string' &&
            Array.isArray(r.like) && r.like.every(l => mongoose.Types.ObjectId.isValid(l)) &&
            Array.isArray(r.dislike) && r.dislike.every(d => mongoose.Types.ObjectId.isValid(d))
        )) {
            return res.json({ status: 400, message: 'Invalid reviews data' });
        }

        const updatedExcursion = await Excursion.findByIdAndUpdate(
            excursionId,
            { $push: { reviews: { $each: reviews } } },
            { new: true, runValidators: true }
        );

        if (!updatedExcursion) {
            return res.json({ status: 404, message: 'Excursion not found' });
        }

        res.json({ status: 200, message: 'Reviews added successfully', data: updatedExcursion });
    } catch (error) {
        res.json({ error: 'Server error' });
    }
};

Router.excursionsFeedBackUpdate = async (req, res) => {
    try {
        const excursionId = req.params.id;
        const reviews = req.body.reviews;

        // Validate reviews field
        if (!Array.isArray(reviews) || !reviews.every(r =>
            typeof r.rating === 'number' &&
            typeof r.name === 'string' &&
            typeof r.createdAt === 'string' &&
            typeof r.good === 'string' &&
            typeof r.bad === 'string' &&
            Array.isArray(r.like) && r.like.every(l => mongoose.Types.ObjectId.isValid(l)) &&
            Array.isArray(r.dislike) && r.dislike.every(d => mongoose.Types.ObjectId.isValid(d))
        )) {
            return res.json({ status: 400, message: 'Invalid reviews data' });
        }

        const updatedExcursion = await Excursion.findByIdAndUpdate(
            excursionId,
            { $set: { reviews } },
            { new: true, runValidators: true }
        );

        if (!updatedExcursion) {
            return res.json({ status: 404, message: 'Excursion not found' });
        }

        res.json({ status: 200, message: 'Reviews updated successfully', data: updatedExcursion });
    } catch (error) {
        res.json({ error: 'Server error' });
    }
};

module.exports = Router;