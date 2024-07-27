const express = require('express');
const accessibleEnvironments = require('../../controllers/hotel/accessibleEnvironments');

const router = express.Router();

router.post('/accessibleEnvironments', accessibleEnvironments.add);
router.get('/accessibleEnvironments', accessibleEnvironments.view);
router.delete('/accessibleEnvironments/:id', accessibleEnvironments.delete);

module.exports = router;