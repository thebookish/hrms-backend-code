// notificationRoutes.js
const express = require('express');
const router = express.Router();
const {
  listNotificationPreferences,
  getOwnPreference,
  setPreference,
} = require('../controllers/notificationController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Auth required
router.use(protect);

// Employees: view/set own
router.get('/me', getOwnPreference);
router.post('/me', setPreference);

// Admin: view/set for others
router.get('/', isAdmin, listNotificationPreferences);
router.post('/', isAdmin, setPreference);

module.exports = router;
