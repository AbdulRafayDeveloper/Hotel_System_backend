const express = require('express');
const roomEntertainments = require('../../controllers/hotel/roomEntertainments');

const router = express.Router();

router.post('/roomEntertainments', roomEntertainments.add);
router.get('/roomEntertainments', roomEntertainments.view);
router.delete('/roomEntertainments/:id', roomEntertainments.delete);

module.exports = router;