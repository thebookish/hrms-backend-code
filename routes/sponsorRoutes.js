// sponsorRoutes.js
const express = require('express');
const router = express.Router();
const {
  listSponsors,
  viewSponsor,
  addSponsor,
  editSponsor,
  removeSponsor,
} = require('../controllers/sponsorController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Admin-only access
router.use(protect, isAdmin);

router.get('/', listSponsors);
router.get('/:id', viewSponsor);
router.post('/', addSponsor);
router.put('/:id', editSponsor);
router.patch('/:id/deactivate', removeSponsor);

module.exports = router;
