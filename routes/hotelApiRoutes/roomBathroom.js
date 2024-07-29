const express = require('express');
const roomBathroom = require('../../controllers/hotel/roomBathroom');

const router = express.Router();

router.post('/roomBathroom', roomBathroom.add);
router.get('/roomBathroom', roomBathroom.view);
router.delete('/roomBathroom/:id', roomBathroom.delete);

module.exports = router;