// employeeRoutes.js
const express = require('express');
const router = express.Router();
const {
  listEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  disableEmployee,
} = require('../controllers/employeeController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Admin-only routes
router.use(protect, isAdmin);

router.get('/', listEmployees);
router.get('/:id', getEmployee);
router.post('/', addEmployee);
router.put('/:id', editEmployee);
router.patch('/:id/deactivate', disableEmployee);

module.exports = router;
