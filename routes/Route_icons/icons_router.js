// routes/icons_routes.js

const express = require('express');
const router = express.Router();
const icon_controller = require('../../controllers/Control_icons/icons_controller');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, "../../public/thumbnails/icons");
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        const extension = path.extname(file.originalname);
        const filename = `${uniqueSuffix}${extension}`;
        cb(null, filename);
    }
});

var upload = multer({
    storage: storage
});

router.post('/icons', upload.single('icon'), icon_controller.addIcon);
router.get('/icons', icon_controller.getIcons)
router.delete('/icons/:id', icon_controller.deleteIcon)

module.exports = router;