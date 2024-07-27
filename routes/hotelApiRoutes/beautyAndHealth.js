const express = require('express');
const beautyAndHealth = require('../../controllers/hotel/beautyAndHealth');

const router = express.Router();

router.post('/beautyAndHealth', beautyAndHealth.add);
router.get('/beautyAndHealth', beautyAndHealth.view);
router.delete('/beautyAndHealth/:id', beautyAndHealth.delete);

module.exports = router;