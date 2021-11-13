const express = require('express');
const router = express.Router();
const checkTokenValidity = require('../middleware/auth');


// const auth = require('../middleware/auth');
const AuthRouteHandlers = require('../controllers/auth');
const EmployeeRouteHandlers = require('../controllers/employee');

router.post('/signup', AuthRouteHandlers.signup);
router.post('/login', AuthRouteHandlers.login);

router.post('/employees',checkTokenValidity, EmployeeRouteHandlers.addEmployee);
router.put('/employees',checkTokenValidity, EmployeeRouteHandlers.updateEmployee);
router.get('/employees', checkTokenValidity, EmployeeRouteHandlers.getEmployeeList);
router.delete('/employees/:id',checkTokenValidity, EmployeeRouteHandlers.deleteEmployee);


module.exports = router;
