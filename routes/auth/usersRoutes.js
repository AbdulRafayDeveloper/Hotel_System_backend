const express = require('express');
const userController = require('../../controllers/auth/userController');

const router = express.Router();

router.post('/owners/signup', userController.ownersSignup);
router.post('/owners/login', userController.ownersLogin);
router.post('/tourists/login', userController.touristLogin);
router.post('/verify', userController.verifyUser);
router.post('/employees/signup', userController.employeesSignup);
router.post('/employees/login', userController.employeesLogin);
router.get('/employees', userController.listOfEmployees);
router.delete('/employees/:id', userController.deleteEmployee);
router.put('/employee/roles/:id', userController.updateAdminAssignRoles);
router.get('/user/:id', userController.getUserRecord);
router.put('/user/:id', userController.updateUserRecord);
router.get('/user/getFavoriteHotel/:id', userController.getFavoriteHotel);
router.get('/user/getFavoriteExcursion/:id', userController.getFavoriteExcursion);


module.exports = router;