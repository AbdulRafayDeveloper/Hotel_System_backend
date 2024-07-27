const express = require('express');
const entertainmentAndSports = require('../../controllers/hotel/entertainmentAndSports');

const router = express.Router();

router.post('/entertainmentAndSports', entertainmentAndSports.add);
router.get('/entertainmentAndSports', entertainmentAndSports.view);
router.delete('/entertainmentAndSports/:id', entertainmentAndSports.delete);

module.exports = router;