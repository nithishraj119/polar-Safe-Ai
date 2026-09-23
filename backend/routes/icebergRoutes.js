const express = require('express');
const router = express.Router();
const { getIcebergs } = require('../controllers/icebergController');

// GET /api/icebergs - Retrieve iceberg tracking list and trajectories
router.get('/', getIcebergs);

module.exports = router;
