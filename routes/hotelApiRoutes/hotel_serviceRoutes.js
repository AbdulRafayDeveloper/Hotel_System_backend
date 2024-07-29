const express = require('express');
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const hotel_serviceController = require('../../controllers/hotel/hotel_serviceController');

const router = express.Router();


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, "../public/thumbnails/hotelservice");
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

router.post('/hotelService', upload.single('icon'), hotel_serviceController.addHotelService);
router.get('/hotelService', hotel_serviceController.listOfHotelService);
router.delete('/hotelService/:id', hotel_serviceController.deleteHotelService);

module.exports = router;