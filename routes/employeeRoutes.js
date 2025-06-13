// employeeRoutes.js
const express = require('express');
const router = express.Router();
const {
  listPendingEmployees,
  listApprovedEmployees,
  // getEmployee,
  approveEmployee,
  declineEmployee,
  addEmployee,
  editEmployee,
  disableEmployee,
} = require('../controllers/employeeController');
const {authenticate, protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getEmployeeByEmail } = require('../models/employeeModel');
// Admin-only routes
router.use(protect);

router.get('/pending', listPendingEmployees);
router.get('/approved', listApprovedEmployees);
router.put('/verify',  isAdmin,approveEmployee);
router.put('/decline',  isAdmin,declineEmployee);
router.put('/edit',  isAdmin,editEmployee);
router.get('/emp-data', getEmployeeByEmail);
router.post(  
  '/apply',
  authenticate,
  upload.fields([
    { name: 'passport', maxCount: 1 },
    { name: 'sponsor', maxCount: 1 }
  ]),
  addEmployee
);
// router.put('/:id', editEmployee);
router.patch('/:id/deactivate', disableEmployee);

module.exports = router;
