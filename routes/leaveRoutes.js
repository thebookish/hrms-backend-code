// leaveRoutes.js
const express = require('express');
const router = express.Router();
const {
  submitLeaveRequest,
  viewOwnLeaves,
  viewAllLeaves,
  approveLeave,
  rejectLeave,
} = require('../controllers/leaveController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Employee-only
router.post('/request', protect, submitLeaveRequest);
router.get('/my-leaves', protect, viewOwnLeaves);

// Admin-only
router.get('/', protect, isAdmin, viewAllLeaves);
router.patch('/:id/approve', protect, isAdmin, approveLeave);
router.patch('/:id/reject', protect, isAdmin, rejectLeave);

module.exports = router;
