const express = require('express');
const roomEquipments = require('../../controllers/hotel/roomEquipments');

const router = express.Router();

router.post('/roomEquipments', roomEquipments.add);
router.get('/roomEquipments', roomEquipments.view);
router.delete('/roomEquipments/:id', roomEquipments.delete);

module.exports = router;