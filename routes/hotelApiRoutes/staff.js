const express = require('express');
const staff = require('../../controllers/hotel/staff');

const router = express.Router();

router.post('/staff', staff.add);
router.get('/staff', staff.view);
router.delete('/staff/:id', staff.delete);

module.exports = router;