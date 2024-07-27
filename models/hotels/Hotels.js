const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    hoteltypes: { type: Schema.Types.ObjectId, ref: 'hoteltypes' },
    thumbs:[String],
    hotelTitle: String,
    address: {
        country: { type: String, enum: ['Russia', 'Abkhazia'], required: true },
        region: String,
        city: String,
        street: String,
        house: String,
        building: String,
    },
    star: Number,
    reception: {
        isAvailable: Boolean,
        isWholeDay: Boolean,
        from: { type: String, default: '00:00' },
        to: { type: String, default: '00:00' },
    },
    checkIn: { type: String, default: '00:00' },
    checkOut: { type: String, default: '00:00' },
    infrastructures: [String],
    services: [String],
    nutririons: [String],
    bars: [String],
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
    amentities: [String],
    conferenceFacilities: [String],
    seaAndBeach: [String],
    petsAllowed: Boolean,
    forChildren: {
        possible: Boolean,
        services: [String]
    },
    accesibleEnvironments: [String],
    staffSays: [String],
    distanceFromTheSea: Number,
    disatanceFromTheCenter: Number,
    roomCategories: [{
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
        amentities: [String],
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
    }],
    applyStatus: { type: String, enum: ['pending', 'allowed', '...'], default: 'pending' }
})

module.exports = mongoose.model("hotels", hotelSchema);