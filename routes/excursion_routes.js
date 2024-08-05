const express = require('express');
const excursion_controller = require('../controllers/excursion_controller');
const upload = require('../helper/upload')

const router = express.Router();
const cpUpload = upload.fields([{ name: 'thumbs', maxCount: 50 }, { name: 'goodPlaceThumbs', maxCount: 50 }])

router.post('/excursions/categories', excursion_controller.addCategory);
router.get('/excursions/categories', excursion_controller.listOfCategories);
router.delete('/excursions/categories/:id', excursion_controller.deleteCategory);

router.post('/excursions/keypoints', excursion_controller.addKeypoint);
router.get('/excursions/keypoints', excursion_controller.listOfKeypoints);
router.delete('/excursions/keypoints/:id', excursion_controller.deleteKeypoint);

router.post('/excursions', cpUpload, excursion_controller.addExcursion);
router.get('/excursions', excursion_controller.listOfExcursions);
router.get('/getExcursion/:id', excursion_controller.getExcursion);
router.put('/excursion/:id', cpUpload, excursion_controller.updateExcursion);
router.delete('/excursions/:id', excursion_controller.deleteExcursion);

router.put('/excursions/feedback/add/:id', excursion_controller.excursionsFeedBackAdd);
router.put('/excursions/feedback/update/:id', excursion_controller.excursionsFeedBackUpdate);

module.exports = router;