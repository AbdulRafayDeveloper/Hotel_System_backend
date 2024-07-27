const express = require('express');
const city_controller = require('../controllers/city_controller');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto'); // Import crypto module for generating random strings

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, "../public/thumbnails/cities");
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

router.get('/typical-cities', city_controller.typicalCities);
router.post('/cities', upload.single('thumbnail'), city_controller.addCity);
router.get('/recommended-places', city_controller.recommendedPlaces);

module.exports = router;