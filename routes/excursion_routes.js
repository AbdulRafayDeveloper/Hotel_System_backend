const express = require('express');
const excursion_controller = require('../controllers/excursion_controller');
const upload = require('../helper/upload')
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
//const cpUpload = upload.fields([{ name: 'thumbs', maxCount: 12 }, { name: 'goodPlaceThumbs', maxCount: 12 }])

const cpUpload = upload.fields([{ name: 'thumbs', maxCount: 12 }])
// Image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, "../../public/thumbnails/categoriesIcon");
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = crypto.randomBytes(16).toString('hex'); // Generate a random string
        const extension = path.extname(file.originalname); // Get the file extension
        cb(null, `${uniqueSuffix}${extension}`); // Append the random string to the filename
    }
});

var upload2 = multer({
    storage: storage
});

router.post('/excursions/categories',upload2.single('icon'), excursion_controller.addCategory);
router.get('/excursions/categories', excursion_controller.listOfCategories);
router.delete('/excursions/categories/:id', excursion_controller.deleteCategory);

router.post('/excursions/keypoints', excursion_controller.addKeypoint);
router.get('/excursions/keypoints', excursion_controller.listOfKeypoints);
router.delete('/excursions/keypoints/:id', excursion_controller.deleteKeypoint);

router.post('/excursions', cpUpload, excursion_controller.addExcursion);
router.get('/excursions', excursion_controller.listOfExcursions);
router.get('/excursions/:id', excursion_controller.getExcursion);
router.delete('/excursions/:id', excursion_controller.deleteExcursion);

router.put('/excursions/feedback/add/:id', excursion_controller.excursionsFeedBackAdd);
router.put('/excursions/feedback/update/:id', excursion_controller.excursionsFeedBackUpdate);

module.exports = router;