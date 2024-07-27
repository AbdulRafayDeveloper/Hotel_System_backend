const express = require('express');
const Router = express.Router();
const ExcursionCategory = require('../models/excursion/excurion_category');
const ExcursionKeypoint = require('../models/excursion/excursion_keypoint');
const Excursion = require('../models/excursion/excursion');
const { successResponse, serverErrorResponse } = require('../helper/successResponse');

// categories
Router.listOfCategories = async (req, res) => {
    try {
        let categories = await ExcursionCategory.find().select({ label: 1, icon: 1, _id: -1 });
        return res.status(200).json(categories);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: 'Internel Server Error' });
    }
};

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
Router.addExcursion = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({ error: 'title is required' });
        }
        const excursion = new Excursion({ ...req.body });

        // get names of uploaded files (thumbs and goodPlaceThumbs)
        if (req.files.thumbs) excursion.thumbs = req.files.thumbs.map((c, i) => `/thumbnails/excursion/${c.filename}`)

        // parse array and object data
        if (req.body.categories) excursion.categories = JSON.parse(req.body.categories)
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
        if (req.body.typeOfVisit) excursion.typeOfVisit = JSON.parse(req.body.typeOfVisit)

        await excursion.save();
        return successResponse(res)
    } catch (error) {
        console.error("Error:", error);
        return serverErrorResponse(res);
    }
}


Router.addKeypoint = async (req, res) => {
    try {
        if (!req.body.label) {
            return res.status(400).json({ error: 'Label is required' });
        }
        if (!req.body.color) {
            return res.status(400).json({ error: 'Color is required' });
        }

        const keypoint = new ExcursionKeypoint({ ...req.body });
        await keypoint.save();

        return successResponse(res)
    } catch (error) {
        console.error("Error:", error);
        return serverErrorResponse(res);
    }
};

Router.excursionsFeedBackUpdate = async (req, res) => {
    try {
        const excursionId = req.params.id;
        const reviews = req.body.reviews;

        console.log("excursionId: ", excursionId);

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

Router.excursionsFeedBackAdd = async (req, res) => {
    try {
        const excursionId = req.params.id;
        const reviews = req.body.reviews;

        console.log("excursionId: ", excursionId);

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

module.exports = Router;