const express = require('express');
const excursion_controller = require('../controllers/excursion_controller');
const upload = require('../helper/upload')



const router = express.Router();
const cpUpload = upload.fields([{ name: 'thumbs', maxCount: 12 }, { name: 'goodPlaceThumbs', maxCount: 12 }])

router.get('/excursions/categories', excursion_controller.listOfCategories);
router.post('/excursions/categories', excursion_controller.addCategory);

router.post('/excursions', cpUpload, excursion_controller.addExcursion);
router.get('/excursions', excursion_controller.listOfExcursions);

router.post('/excursions/keypoints', excursion_controller.addKeypoint);

router.put('/excursions/feedback/update/:id', excursion_controller.excursionsFeedBackUpdate);
router.put('/excursions/feedback/add/:id', excursion_controller.excursionsFeedBackAdd);
module.exports = router;