const express = require('express');
const childrenFacilities = require('../../controllers/hotel/childrenFacilities');

const router = express.Router();

router.post('/childrenFacilities', childrenFacilities.add);
router.get('/childrenFacilities', childrenFacilities.view);
router.delete('/childrenFacilities/:id', childrenFacilities.delete);

module.exports = router;