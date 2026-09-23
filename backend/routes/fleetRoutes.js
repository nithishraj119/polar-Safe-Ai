const express = require('express');
const router = express.Router();
const fleetController = require('../controllers/fleetController');

router.get('/', fleetController.getFleet);
router.get('/:id', fleetController.getVessel);

module.exports = router;
