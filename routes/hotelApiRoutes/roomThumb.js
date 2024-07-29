const express = require('express');
const router = express.Router();
const roomThumb = require('../../controllers/hotel/roomThumb')
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, "../../public/thumbnails/rooms");
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


router.post('/room/thumbnail', upload.single('thumb'), roomThumb.uploadThumbnail);
router.delete('/room/thumbnail/:filename', roomThumb.removeThumbnail);

module.exports = router;