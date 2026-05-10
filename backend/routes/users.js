const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, 'profile-' + Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.put('/profile', authMiddleware, upload.single('profile_photo'), userController.updateProfile);
router.delete('/account', authMiddleware, userController.deleteAccount);

// Admin routes
router.get('/admin/users', authMiddleware, userController.getAllUsers);
router.get('/admin/analytics', authMiddleware, userController.getAdminAnalytics);

module.exports = router;
