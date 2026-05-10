const express = require('express');
const router = express.Router();
const packingController = require('../controllers/packingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/:tripId', packingController.getItems);
router.post('/', packingController.addItem);
router.put('/:id/toggle', packingController.toggleItem);
router.delete('/:id', packingController.deleteItem);
router.put('/:tripId/reset', packingController.resetItems);

module.exports = router;
