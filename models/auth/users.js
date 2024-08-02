const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String },
    position: { type: String },
    mail: { type: String, unique: true },
    password: { type: String },
    phoneNumber: { type: String },
    role: { type: String },
    verificationCode: { type: String },
    verified: { type: Boolean },
    codeExpiration: { type: Date },
    accountStatus: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    },
    adminAssignedRoles: [String],
    favouriteHotels: [{ type: Schema.Types.ObjectId, ref: 'hotels' }],
    favouriteExcursions: [{ type: Schema.Types.ObjectId, ref: 'excursions' }],
    myHotel: { type: Schema.Types.ObjectId, ref: 'hotels' }
});

module.exports = mongoose.model("users", userSchema);