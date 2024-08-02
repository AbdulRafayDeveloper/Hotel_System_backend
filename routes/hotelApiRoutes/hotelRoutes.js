const express = require('express');
const hotelController = require('../../controllers/hotel/hotelController');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const passport = require('passport');

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

router.delete('/hotel/remove-my-hotel', passport.authenticate("jwt", { session: false }), hotelController.removeMyHotel);
router.get('/hotel/my-hotel-status', passport.authenticate("jwt", { session: false }), hotelController.myHotelStatus);
router.get('/hotel/my-hotel-data', passport.authenticate("jwt", { session: false }), hotelController.myHotelData);
router.post('/hotel/thumbnail', passport.authenticate("jwt", { session: false }), upload.single('thumb'), hotelController.uploadThumbnail);
router.delete('/hotel/thumbnail/:filename', passport.authenticate("jwt", { session: false }), hotelController.removeThumbnail);
router.post('/hotel', passport.authenticate("jwt", { session: false }), hotelController.addHotel);
router.post('/hotel/:id', passport.authenticate("jwt", { session: false }), hotelController.addRoomCategories);
router.get('/hotel', passport.authenticate("jwt", { session: false }), hotelController.listOfHotel);
router.get('/hotel/:id', passport.authenticate("jwt", { session: false }), hotelController.getHotel);
router.delete('/hotel/:id', passport.authenticate("jwt", { session: false }), hotelController.deleteHotel);
router.put('/hotel/status/allow/:id', passport.authenticate("jwt", { session: false }), hotelController.statusAllowOfHotelApplication);
router.put('/hotel/status/reject/:id', passport.authenticate("jwt", { session: false }), hotelController.statusRejectOfHotelApplication);
router.put('/hotel/feedback/update/:id', passport.authenticate("jwt", { session: false }), hotelController.hotelFeedBackUpdate);
router.put('/hotel/feedback/add/:id', passport.authenticate("jwt", { session: false }), hotelController.hotelFeedBackAdd);

module.exports = router;