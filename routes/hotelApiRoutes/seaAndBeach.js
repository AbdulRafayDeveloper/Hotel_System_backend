const express = require('express');
const seaAndBeach = require('../../controllers/hotel/seaAndBeach');

const router = express.Router();

router.post('/seaAndBeach', seaAndBeach.add);
router.get('/seaAndBeach', seaAndBeach.view);
router.delete('/seaAndBeach/:id', seaAndBeach.delete);

module.exports = router;