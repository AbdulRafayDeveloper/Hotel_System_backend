const express = require('express');
const Router = express.Router();
const mongoose = require("mongoose");
// const hotelTypes = require('../../models/hotels/Hotel_Types');
const Hotel = require('../../models/hotels/Hotels');
const fs = require('fs');
const path = require('path');
const withPrefix = require('../../helper/withPrefix');
const HotelModel = require('../../models/hotels/Hotels');

Router.removeMyHotel = async (req, res) => {
    if (!req.user.myHotel)
        return res.json({
            message: 'you did not registered any hotel information'
        })

    const hotel = await HotelModel.findById(req.user.myHotel)
    hotel.status = 'deleted'
    req.user.myHotel = null
    await req.user.save()
    await hotel.save()
    return res.json({ message: 'deleted successfully' })
}

Router.myHotelStatus = async (req, res) => {
    if (!req.user.myHotel)
        return res.json({
            status: 'empty',
            message: 'you did not registered any hotel information'
        })

    const hotel = await HotelModel.findById(req.user.myHotel)

    if (hotel.status === 'allowed')
        return res.json({
            status: 'allowed',
            message: 'your application is allowed',
        })
    else {
        return res.json({
            status: 'pending',
            message: 'your application is pending',
        })
    }
}

Router.myHotelData = async (req, res) => {
    if (!req.user.myHotel)
        return res.json({
            status: 'empty',
            message: 'you did not registered any hotel information'
        })

    const hotel = await HotelModel.findById(req.user.myHotel)

    if (hotel.status === 'allowed')
        return res.json({
            status: 'allowed',
            message: 'your application is allowed',
            hotel
        })
    else {
        return res.json({
            status: 'pending',
            message: 'your application is pending',
            hotel
        })
    }
}

Router.addHotel = async (req, res) => {
    try {
        const hotelType = req.body.hotelType || "";
        const hotelTitle = req.body.hotelTitle || "";
        const address = req.body.address ? req.body.address : {};
        const star = req.body.star || "";
        const reception = req.body.reception ? req.body.reception : {};
        const checkIn = req.body.checkIn || "";
        const checkOut = req.body.checkOut || "";
        const infrastructures = req.body.infrastructures ? req.body.infrastructures : [];
        const amenities = req.body.amenities ? req.body.amenities : [];
        const services = req.body.services ? req.body.services : [];
        const nutritions = req.body.nutritions ? req.body.nutritions : [];
        const bars = req.body.bars ? req.body.bars : [];
        const beautyAndHealth = req.body.beautyAndHealth ? req.body.beautyAndHealth : [];
        const internet = req.body.internet ? req.body.internet : {};
        const transport = req.body.transport ? req.body.transport : {};
        const conferenceFacilities = req.body.conferenceFacilities ? req.body.conferenceFacilities : [];
        const seaAndBeach = req.body.seaAndBeach ? req.body.seaAndBeach : {};
        const petsAllowed = req.body.petsAllowed || false;
        const forChildren = req.body.forChildren ? req.body.forChildren : {};
        const accesibleEnvironments = req.body.accesibleEnvironments ? req.body.accesibleEnvironments : [];
        const staffSays = req.body.staffSays ? req.body.staffSays : [];
        const distanceFromTheSea = req.body.distanceFromTheSea || 0;
        const distanceFromTheCenter = req.body.distanceFromTheCenter || 0;
        const reviews = req.body.reviews ? req.body.reviews : [];
        const applyStatus = req.body.applyStatus || "";
        const capacity = req.body.capacity || "";
        const price = req.body.price ? req.body.price : {};
        const roomCategories = req.body.roomCategories ? req.body.roomCategories : []
        const thumbs = req.body.thumbs;
        const tariffs = req.body.tariffs;

        // Validate required fields
        if (!hotelType) {
            return res.status(400).json({ error: 'Hotel type is required' });
        }

        if (!hotelTitle) {
            return res.status(400).json({ error: 'Hotel title is required' });
        }

        if (!address || !address.country) {
            return res.status(400).json({ error: 'Country is required' });
        }

        // Validate country enum
        const validCountries = ['Россия', 'Abkhazia'];
        if (!validCountries.includes(address.country)) {
            return res.status(400).json({ error: 'Invalid country' });
        }

        // Check nested objects and arrays
        if (reception) {
            if (reception.isAvailable !== undefined && typeof reception.isAvailable !== 'boolean') {
                return res.status(400).json({ error: 'Reception isAvailable must be a boolean' });
            }
            if (reception.isWholeDay !== undefined && typeof reception.isWholeDay !== 'boolean') {
                return res.status(400).json({ error: 'Reception isWholeDay must be a boolean' });
            }
        }

        // Construct object
        const data = {
            hotelType,
            thumbs,
            hotelTitle,
            address,
            star,
            reception,
            checkIn,
            checkOut,
            infrastructures,
            amenities,
            services,
            nutritions,
            bars,
            beautyAndHealth,
            internet,
            transport,
            conferenceFacilities,
            seaAndBeach,
            petsAllowed,
            forChildren,
            accesibleEnvironments,
            staffSays,
            distanceFromTheSea,
            distanceFromTheCenter,
            reviews,
            applyStatus,
            capacity,
            price,
            roomCategories,
            applyStatus: 'pending',
            tariffs,
        };

        // Create a new Hotel instance
        const newHotel = new Hotel(data);
        const hotelId = await newHotel.save();
        req.user.myHotel = hotelId
        await req.user.save()

        res.status(201).json({ message: 'Hotel added successfully', hotel: newHotel });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to add hotel' });
    }
};

Router.addRoomCategories = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.files.photos || req.files.photos.length === 0) {
            return res.status(400).json({ error: 'Image files for photos not provided' });
        }

        // Process photos
        const photoFilenames = req.files.photos.map(file => file.filename);
        const photos = photoFilenames.map(filename => `/thumbnails/hotels/${filename}`);

        // Construct hotelDetails object
        const data = {
            size: req.body.roomAmount,
            roomAmount: req.body.roomAmount,
            adultAmount: req.body.adultAmount,
            childrenAmount: req.body.childrenAmount,
            additionalPlaceAmount: req.body.additionalPlaceAmount,
            accommodation: {
                singleBeds: req.body.singleBeds,
                doubleBeds: req.body.doubleBeds,
                additionalBeds: req.body.additionalBeds
            },
            amenities: req.body.amenities,
            photos: photos
        };

        const hotelRecord = await Hotel.findById(id);
        hotelRecord.roomCategories.push(data);

        const result = await hotelRecord.save();

        res.status(201).json({ message: 'Hotel updated with room categories successfully', hotel: result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to add hotel' });
    }
};

Router.listOfHotel = async (req, res) => {
    try {
        // Extract filters from query parameters
        const {
            city,
            page,
            perPage,
            orderMethod,
            orderBy,
            priceFrom,
            priceTo,
            star,
            hotelType,
            distanceFromTheSea,
            distanceFromTheCenter
        } = req.query;

        // Validation for filters
        if (city && typeof city !== 'string') {
            return res.status(400).json({ error: 'City must be a string' });
        }

        if (page && isNaN(parseInt(page, 10))) {
            return res.status(400).json({ error: 'Page must be a number' });
        }

        if (perPage && isNaN(parseInt(perPage, 10))) {
            return res.status(400).json({ error: 'perPage must be a number' });
        }


        if (hotelType && !mongoose.Types.ObjectId.isValid(hotelType)) {
            return res.status(400).json({ error: 'Invalid hotelType ObjectId' });
        }

        if (priceFrom && isNaN(parseFloat(priceFrom))) {
            return res.status(400).json({ error: 'priceFrom must be a number' });
        }

        if (priceTo && isNaN(parseFloat(priceTo))) {
            return res.status(400).json({ error: 'priceTo must be a number' });
        }

        // Build query object based on provided filters
        const query = {};

        if (city) {
            query['address.city'] = city;
        }

        if (star) query['star'] = { $in: star.split(",") }

        if (hotelType) {
            query.hotelType = hotelType; // Assuming hotelType is an ObjectId
        }

        if (distanceFromTheSea) {
            const distance = distanceFromTheSea.split(',')
            if (distance[0] == 'lessThan') query['distanceFromTheSea'] = { $lte: parseInt(distance[1], 10) }
            if (distance[0] == 'moreThan') query['distanceFromTheSea'] = { $gte: parseInt(distance[1], 10) }
        }

        if (distanceFromTheCenter) {
            const distance = distanceFromTheCenter.split(',')
            if (distance[0] == 'lessThan') query['distanceFromTheCenter'] = { $lte: parseInt(distance[1], 10) }
            if (distance[0] == 'moreThan') query['distanceFromTheCenter'] = { $gte: parseInt(distance[1], 10) }
        }

        if (priceFrom || priceTo) {
            query['price.discounted'] = {};
            if (priceFrom) {
                query['price.discounted'].$gte = parseFloat(priceFrom);
            }
            if (priceTo) {
                query['price.discounted'].$lte = parseFloat(priceTo);
            }
        }

        // Pagination
        const pageNumber = parseInt(page, 10) || 1;
        const itemsPerPage = parseInt(perPage, 10) || 10;
        const skip = (pageNumber - 1) * itemsPerPage;

        // Fetch hotels based on query
        const hotels = await Hotel.find(query)
            .skip(skip)
            .limit(itemsPerPage)
            .sort({ [orderBy]: orderMethod === 'desc' ? -1 : 1 })
            .exec();

        res.status(200).json({ hotels, count: hotels.length });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while fetching hotels' });
    }
};

Router.getHotel = async (req, res) => {
    try {
        if (!req.params.id) return res.json({ status: 400, message: "Hotel id is required" })
        const hotel = await Hotel.findById(req.params.id)
        return res.status(200).json(hotel)
    } catch (error) {
        console.error('Error: ', error)
        res.status(500).json({ message: "An error occured during get hotel data" })
    }
}

Router.deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Hotel ID is required' });
        }

        const hotel = await Hotel.findById(id);

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        // Extract image paths from the thumbs array
        const thumbsPaths = hotel.thumbs.map(img => path.join(__dirname, '../../public', img));

        // Extract image paths from the photos array within each room category
        const photosPaths = hotel.roomCategories.flatMap(category =>
            category.photos.map(img => path.join(__dirname, '../../public', img))
        );

        // Combine all paths
        const allImagePaths = [...thumbsPaths, ...photosPaths];

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
        const deletedHotel = await Hotel.findByIdAndDelete(id);

        // Check if the hotel was deleted
        if (!deletedHotel) {
            return res.status(404).json({ error: 'Hotel could not be deleted' });
        }

        res.status(200).json({ status: 200, message: 'Hotel deleted successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while deleting the hotel' });
    }
};

Router.statusAllowOfHotelApplication = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Application ID is required' });
        }

        const hotel = await Hotel.findById(id);

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        // Toggle applyStatus based on current value
        if (hotel.applyStatus === 'pending') {
            hotel.applyStatus = 'allowed';
        } else {
            return res.status(400).json({ status: 400, message: 'Status is already allowed.', updatedHotel: hotel });
        }

        await hotel.save();

        res.status(200).json({ status: 200, message: 'Application status changed successfully', updatedHotel: hotel });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while deleting the hotel' });
    }
};


Router.statusRejectOfHotelApplication = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Application ID is required' });
        }

        const hotel = await Hotel.findById(id);

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        if (hotel.applyStatus === 'allowed') {
            hotel.applyStatus = 'pending';
        }
        else {
            return res.status(400).json({ status: 400, message: 'Status is already pending.', updatedHotel: hotel });
        }

        await hotel.save();

        res.status(200).json({ status: 200, message: 'Application status changed successfully', updatedHotel: hotel });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while deleting the hotel' });
    }
};

Router.hotelFeedBackAdd = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const reviews = req.body.reviews;

        if (!Array.isArray(reviews) || !reviews.every(r =>
            r.name && Array.isArray(r.marks) && r.marks.every(m => m.label && m.mark) &&
            r.good !== undefined && r.bad !== undefined)) {
            return res.json({ status: 400, message: 'Invalid reviews data' });
        }

        const updatedHotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { $push: { reviews: { $each: reviews } } },
            { new: true, runValidators: true }
        );

        if (!updatedHotel) {
            return res.json({ status: 404, message: 'Hotel not found' });
        }

        res.json({ status: 200, message: 'Reviews added successfully', data: updatedHotel });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

Router.hotelFeedBackUpdate = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const reviews = req.body.reviews;

        if (!Array.isArray(reviews) || !reviews.every(r =>
            r.name && Array.isArray(r.marks) && r.marks.every(m => m.label && m.mark) &&
            r.good !== undefined && r.bad !== undefined)) {
            return res.json({ status: 400, message: 'Invalid reviews data' });
        }

        const updatedHotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { $set: { reviews } },
            { new: true, runValidators: true }
        );

        if (!updatedHotel) {
            return res.json({ status: 404, message: 'Hotel not found' });
        }

        res.json({ status: 200, message: 'updated successfully', data: updatedHotel });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

Router.uploadThumbnail = async (req, res) => {
    try {
        if (!req.file || !req.file.filename) {
            return res.status(400).json({ error: 'Image file not provided' });
        }
        const thumb = `/thumbnails/hotels/${req.file.filename}`;
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
    const filePath = path.join(__dirname, `../../public/thumbnails/hotels/${req.params.filename}`)
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'file remove failed' })
        } else {
            res.status(200).json({ message: 'file removed' })
        }
    });
}
module.exports = Router;