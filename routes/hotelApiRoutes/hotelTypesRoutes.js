const express = require('express');
const hotelTypesController = require('../../controllers/hotel/hotelTypesController');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, "../../public/thumbnails/hotel_type");
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = crypto.randomBytes(16).toString('hex'); // Generate a random string
        const extension = path.extname(file.originalname); // Get the file extension
        cb(null, `${uniqueSuffix}${extension}`); // Append the random string to the filename
    }
});

var upload = multer({
    storage: storage
});

const router = express.Router();

router.post('/hotelTypes', upload.single('thumb'), hotelTypesController.addHotelTypes);
router.get('/hotelTypes', hotelTypesController.listOfHotelsTypes);
router.delete('/hotelTypes/:id', hotelTypesController.deleteHotelTypes);

module.exports = router;