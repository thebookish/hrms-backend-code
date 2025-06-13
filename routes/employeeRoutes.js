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
  // editEmployee,
  disableEmployee,
} = require('../controllers/employeeController');
const {authenticate, protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
// Admin-only routes
router.use(protect);

router.get('/pending', listPendingEmployees);
router.get('/approved', listApprovedEmployees);
router.put('/verify',  approveEmployee);
router.put('/decline',  declineEmployee);
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
