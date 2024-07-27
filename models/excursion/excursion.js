const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const excursionSchema = new Schema({
    title: { type: String, required: true },
    address: {
        country: { type: String, enum: ['Russia', 'Abkhazia'], required: true },
        region: String,
        city: String,
        street: String,
        house: String,
        building: String,
    },
    categories: [String],  // says in which categories this excursion is involved   i.e. [ "Jeeping", "Into the mountains" ]
    thumbs: [String],
    keyPoints: [{ color: String, label: String }],
    departure: { type: String },
    arrival: { type: String },
    description: {
        type: String
    },
    program: [
        { description: String, duration: Number }
    ],
    goodPlaces: [
        {
            thumb: String,
            title: String,
            description: String,
        }
    ],
    howToWork: String,
    priceDetail: {
        include: [String],
        uninclude: [String]
    },
    consider: [String],
    reviews: [{
        rating: Number,
        name: String,
        createdAt: Date,
        good: String,
        bad: String,
        like: [{ type: Schema.ObjectId, ref: 'User' }],
        dislike: [{ type: Schema.ObjectId, ref: 'User' }]
    }],
    typeOfVisit: { typeof: String, maxPeople: Number },
    duration: Number,
    withGuider: Boolean,
    withBus: Boolean,
    ticketPrice: Number,
    priceFor: [
        { sortByAge: String, price: Number }
    ],
    start: [Number],
    excursionType: String
});

module.exports = mongoose.model("excursions", excursionSchema);