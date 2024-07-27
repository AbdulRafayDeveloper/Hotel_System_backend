const express = require('express')
const qaasController = require('../controllers/qaas_controller')
const router = express.Router();

router.post('/qaas', qaasController.addQaas)
router.get('/qaas', qaasController.listQaas)

module.exports = router;