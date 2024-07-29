const express = require('express');
const hotelController = require('../../controllers/hotel/hotelController');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, "../../public/thumbnails/hotels");
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

router.post('/hotel/thumbnail', upload.single('thumb'), hotelController.uploadThumbnail);
router.delete('/hotel/thumbnail/:filename', hotelController.removeThumbnail);
router.post('/hotel', hotelController.addHotel);
router.post('/hotel/:id', hotelController.addRoomCategories);
router.get('/hotel', hotelController.listOfHotel);
router.get('/hotel/:id', hotelController.getHotel);
router.delete('/hotel/:id', hotelController.deleteHotel);
router.put('/hotel/status/allow/:id', hotelController.statusAllowOfHotelApplication);
router.put('/hotel/status/reject/:id', hotelController.statusRejectOfHotelApplication);
router.put('/hotel/feedback/update/:id', hotelController.hotelFeedBackUpdate);
router.put('/hotel/feedback/add/:id', hotelController.hotelFeedBackAdd);

module.exports = router;