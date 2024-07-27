const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    booking_number: { type: String },
    comments: { type: String },
    hotelId: { type: Schema.Types.ObjectId, ref: 'hotel_model' },
    resident: [{
        amount: { type: Number },
        personType: { type: String, enum: ['adult', 'child', '...'] }
    }],
    checkIn: { type: Date },
    checkOut: { type: Date },
    roomCategoryId: { type: Schema.Types.ObjectId, ref: 'room_category_model' },
    holidays: [{
        day: { type: Date },
        excursion: { type: Schema.Types.ObjectId, ref: 'excursion_model' }
    }],
    cancelableTime: { type: String },
    price: {
        booking: {
            total: { type: Number },
            prepay: { type: Number },
        },
    },
    promo_code: {
        code: { type: String },
        discount: { type: Number }
    }
},
    {
        timestamps: {
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        }
    });

module.exports = mongoose.model("bookings", bookingSchema);
