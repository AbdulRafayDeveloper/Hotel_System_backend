const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    hotelType: { type: String },
    thumbs: [String],
    hotelTitle: String,
    address: {
        country: { type: String, enum: ['Россия', 'Abkhazia'], required: true },
        region: String,
        city: String,
        street: String,
        house: String,
        building: String,
    },
    amenities: [String],
    status: { type: String, enum: ['empty', 'pending', 'allowed', 'deleted'] },
    star: Number,
    reception: {
        isAvailable: Boolean,
        isWholeDay: Boolean,
        from: { type: String, default: '00:00' },
        to: { type: String, default: '24:00' },
    },
    checkIn: { type: String, default: '00:00' },
    checkOut: { type: String, default: '00:00' },
    infrastructures: [String],
    services: [String],
    nutritions: [String],
    bars: [String],
    entertainmentsAndSports: [String],
    beautyAndHealth: [String],
    internet: {
        wifiInHotel: {
            available: Boolean,
            includedInThePrice: Boolean,
        },
        wifiInRoom: {
            available: Boolean,
            includedInThePrice: Boolean,
        },
    },
    transport: {
        parking: {
            available: Boolean,
            includedInThePrice: Boolean,
        },
        transfer: {
            available: Boolean,
            includedInThePrice: Boolean,
            price: Number,
        },
        services: [String],

    },
    conferenceFacilities: [String],
    seaAndBeach: [String],
    petsAllowed: { type: Boolean, default: false },
    forChildren: {
        possible: Boolean,
        services: [String]
    },
    accesibleEnvironments: [String],
    staffSays: [String],
    distanceFromTheSea: Number,
    distanceFromTheCenter: Number,
    roomCategories: [{
        categoryName: String,
        size: Number,
        roomAmount: Number,
        adultAmount: Number,
        childrenAmount: Number,
        additionalPlaceAmount: Number,
        accommodation: {
            singleBeds: Number,
            doubleBeds: Number,
            additionalBeds: Number,
        },
        entertainments: [String],
        equipments: [String],
        bathroom: [String],
        photos: [String],
    }],
    reviews: [{
        name: String,
        marks: [{
            label: String,
            mark: Number,
        }],
        good: String,
        bad: String,
        createdAt: String,
        like: Number,
        dislike: Number
    }],
    applyStatus: { type: String, enum: ['pending', 'allowed'], default: 'pending' },
    capacity: String,
    price: {
        isDiscounted: Boolean,
        original: Number,
        discounted: Number
    },
    tariffs: [{
        tariffName: String,
        tariffName: String,
        tariffType: String,
        nutrition: String,
        cancelReservation: String,
        roomCategory: String,
    }]

})

module.exports = mongoose.model("hotels", hotelSchema);