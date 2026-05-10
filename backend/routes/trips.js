const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.use(authMiddleware);

router.post('/', upload.single('cover_image'), tripController.createTrip);
router.get('/', tripController.getTrips);
router.get('/stats', tripController.getDashboardStats);
router.get('/:id', tripController.getTrip);
router.put('/:id', upload.single('cover_image'), tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

module.exports = router;
