const express = require('express');
const router = express.Router();
const { getEnvironment, updateEnvironment } = require('../controllers/environmentController');
const { validateEnvironmentUpdate } = require('../middleware/validator');

// GET /api/environment - Fetch current environmental telemetry
router.get('/', getEnvironment);

// POST /api/environment - Update environmental conditions
router.post('/', validateEnvironmentUpdate, updateEnvironment);

module.exports = router;
