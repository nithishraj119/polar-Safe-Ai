const express = require('express');
const router = express.Router();
const { analyzeRoute, getRoutesHistory } = require('../controllers/routeController');

// POST /api/analyze-route - Calculate risk and generate recommended routes (A, B, C)
router.post('/analyze-route', analyzeRoute);

// GET /api/routes - Retrieve recent route analysis history
router.get('/', getRoutesHistory);

module.exports = router;