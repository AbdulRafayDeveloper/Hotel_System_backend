const express = require('express');
const domain_controller = require('../controllers/domain_controller');

const router = express.Router();

router.post('/domains', domain_controller.setDomain);

module.exports = router;