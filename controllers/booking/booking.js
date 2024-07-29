const express = require('express');
const Router = express.Router();
const Booking = require('../../models/booking/bookings');

Router.add = async (req, res) => {
    try {
        const {
            user, booking_number, comments, hotelId, resident, checkIn, checkOut,
            roomCategoryId, cancelableTime, price, promo_code
        } = req.body;

        if (!user || !booking_number || !hotelId || !checkIn || !checkOut || !price || !price.booking) {
            return res.json({ status: 400, message: 'Required fields are missing' });
        }

        // Check if a similar booking already exists
        const existingBooking = await Booking.findOne({ booking_number });
        if (existingBooking) {
            return res.json({ status: 409, message: 'This booking already exists in the database' });
        }

        const newBooking = new Booking({
            user, booking_number, comments, hotelId, resident, checkIn, checkOut,
            roomCategoryId, cancelableTime, price, promo_code
        });

        const data = await newBooking.save();

        if (data) {
            res.json({ status: 200, message: 'Booking added successfully', data: data });
        } else {
            res.json({ status: 500, message: 'Internal server error' });
        }
    } catch (error) {
        console.log("error in catch block: ", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

Router.addHolidays = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { day, excursion } = req.body;

        if (!day || !excursion) {
            return res.json({ status: 400, message: 'Required fields are missing' });
        }

        // Find the booking by ID
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ status: 404, message: 'Booking not found' });
        }

        // Add the holiday to the booking
        booking.holidays.push({ day, excursion });
        const result = await booking.save();

        if (result) {
            res.json({ status: 200, message: 'Holiday added in booking successfully', booking });
        } else {
            res.json({ status: 500, message: 'Internal server error' });
        }
    } catch (error) {
        console.log("error in catch block: ", error);
        res.json({ status: 500, message: 'Internal Server Error' });
    }
};

Router.view = async (req, res) => {
    try {
        // Extract filters from query parameters
        const { holidaysOnly, excursionsOnly, dateAfter, dateBefore, page, perPage, orderMethod, orderBy } = req.query;

        // Validation for filters
        if (page && isNaN(parseInt(page, 10))) {
            return res.json({ status: 400, message: 'Page must be a number' });
        }

        if (perPage && isNaN(parseInt(perPage, 10))) {
            return res.json({ status: 400, message: 'perPage must be a number' });
        }

        // Build query object based on provided filters
        const query = {};

        if (holidaysOnly === 'true') {
            query.holidays = { $exists: true, $ne: [] };
        }

        if (excursionsOnly === 'true') {
            query['holidays.excursion'] = { $exists: true, $ne: null };
        }

        const today = new Date();
        if (dateAfter) {
            query.checkIn = { $gte: new Date(dateAfter) };
        } else {
            query.checkIn = { $gte: today };
        }

        if (dateBefore) {
            query.checkOut = { $lte: new Date(dateBefore) };
        }

        // Pagination
        const pageNumber = parseInt(page, 10) || 1;
        const itemsPerPage = parseInt(perPage, 10) || 10;
        const skip = (pageNumber - 1) * itemsPerPage;

        // Fetch bookings based on query
        const bookings = await Booking.find(query)
            .skip(skip)
            .limit(itemsPerPage)
            .sort({ [orderBy]: orderMethod === 'desc' ? -1 : 1 })
            .exec();

        res.json({ status: 200, message: "data get successfully", data: bookings });
    } catch (error) {
        console.log("error in catch block: ", error);
        res.json({ status: 500, message: 'An error occurred while fetching bookings' });
    }
};

// Update holidays in a booking
Router.update = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const holidays = req.body.holidays;

        if (!Array.isArray(holidays) || !holidays.every(h => h.day && h.excursion)) {
            return res.json({ status: 400, message: "Invalid holidays data" });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { $set: { holidays } },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.json({ status: 404, message: "Booking not found", data: updatedBooking });
        }

        res.json({ status: 200, message: "updated successfully", data: updatedBooking });
    } catch (error) {
        console.log("error in catch block: ", error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = Router;