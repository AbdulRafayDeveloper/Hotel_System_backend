// routes/icons_routes.js

const express = require('express');
const router = express.Router();
const icon_controller = require('../../controllers/Control_icons/icons_controller');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto'); // Import crypto module for generating random strings

console.log('router 1');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, "../../public/thumbnails/icons");
        cb(null, destinationPath);
        console.log('destination: ', destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = crypto.randomBytes(16).toString('hex'); // Generate a random string
        const extension = path.extname(file.originalname); // Get the file extension
        const filename = `${uniqueSuffix}${extension}`; // Append the random string to the filename
        cb(null, filename); // Set the filename for the file
        console.log("file saved:", filename); // Log the filename
        console.log('file extension: ', extension);
    }
});

console.log('router 2');

var upload = multer({
    storage: storage
});

router.post('/icons', upload.single('icon'), icon_controller.addIcon);
router.get('/icons', icon_controller.getIcons)
router.delete('/icons/:id', icon_controller.deleteIcon)

module.exports = router;
