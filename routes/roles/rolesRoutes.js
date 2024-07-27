const express = require('express');
const rolesController = require('../../controllers/roles/rolesController');

const router = express.Router();

router.post('/roles', rolesController.addRole);
router.get('/roles', rolesController.listOfRoles);
router.delete('/roles/:id', rolesController.deleteRole);

module.exports = router;