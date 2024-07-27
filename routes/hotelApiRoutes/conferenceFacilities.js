const express = require('express');
const conferenceFacilities = require('../../controllers/hotel/conferenceFacilities');

const router = express.Router();

router.post('/conferenceFacilities', conferenceFacilities.add);
router.get('/conferenceFacilities', conferenceFacilities.view);
router.delete('/conferenceFacilities/:id', conferenceFacilities.delete);

module.exports = router;