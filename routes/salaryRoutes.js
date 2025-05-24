// salaryRoutes.js
const express = require('express');
const router = express.Router();
const {
  viewOwnSalaryHistory,
  viewAllSalaries,
  updateSalary,
} = require('../controllers/salaryController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Employee route
router.get('/my-history', protect, viewOwnSalaryHistory);

// Admin routes
router.get('/', protect, isAdmin, viewAllSalaries);
router.post('/', protect, isAdmin, updateSalary);

module.exports = router;
