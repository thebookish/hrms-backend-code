// routes/userRoutes.js
const express = require('express');
const { getUserByEmail } = require('../controllers/userController');
const { updateProfile } = require('../controllers/userController'); // Or userController if separated
const { authenticate } = require('../middleware/authMiddleware'); // JWT middleware
const router = express.Router();



router.put('/update-profile', authenticate, updateProfile);
router.get('/by-email', getUserByEmail); // e.g. /api/users/by-email?email=test@example.com

module.exports = router;
