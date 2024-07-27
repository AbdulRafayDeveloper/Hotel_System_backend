const express = require('express');
const roomAmenities = require('../../controllers/hotel/roomAmenities');

const router = express.Router();

router.post('/roomAmenities', roomAmenities.add);
router.get('/roomAmenities', roomAmenities.view);
router.delete('/roomAmenities/:id', roomAmenities.delete);

module.exports = router;