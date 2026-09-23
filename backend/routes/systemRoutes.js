const express = require('express');
const router = express.Router();
const { getHealth, getSystemStatus } = require('../controllers/systemController');

// GET /api/health - Health check endpoint
router.get('/health', getHealth);

// GET /api/system/status - Full subsystem status
router.get('/system/status', getSystemStatus);

module.exports = router;
