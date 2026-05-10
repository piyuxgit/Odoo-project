const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/stops', itineraryController.addStop);
router.put('/stops/:id', itineraryController.updateStop);
router.delete('/stops/:id', itineraryController.deleteStop);
router.put('/stops/reorder', itineraryController.reorderStops);
router.post('/activities', itineraryController.addActivityToStop);
router.delete('/activities/:id', itineraryController.removeActivityFromStop);

module.exports = router;
