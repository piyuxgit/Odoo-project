const express = require('express');
const router = express.Router();
const sharingController = require('../controllers/sharingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes (no auth)
router.get('/:slug', sharingController.getSharedTrip);

// Protected routes
router.post('/', authMiddleware, sharingController.shareTrip);
router.post('/:slug/copy', authMiddleware, sharingController.copyTrip);
router.delete('/:tripId', authMiddleware, sharingController.unshareTrip);

module.exports = router;
