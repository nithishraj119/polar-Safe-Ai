const { query, checkConnection } = require('../config/db');
const { analyzeRisk } = require('../services/riskService');
const { exportToECDISGeoJSON } = require('../services/geodesicRouteService');

/**
 * Controller: Analyze Route Risk and Compute Safe Multi-Criteria Corridors
 * POST /api/analyze-route
 */
const analyzeRoute = async (req, res, next) => {
  try {
    const { start, destination, environmentalData, vesselIceClass = 'PC3' } = req.body;

    if (!start || !destination) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Both start and destination coordinates are required.'
      });
    }

    // Default environmental baseline if not provided
    const seaIce = environmentalData?.seaIceConcentration ?? 63;
    const icebergDist = environmentalData?.nearestIcebergDistance ?? 24;
    const icebergDensity = environmentalData?.icebergDensity ?? 17;

    // Run core multi-factor analysis & POLARIS evaluation
    const analysis = analyzeRisk(
      seaIce,
      icebergDist,
      icebergDensity,
      start,
      destination,
      vesselIceClass
    );

    const isDbConnected = await checkConnection();

    // Persist analysis to MySQL if connected
    if (isDbConnected) {
      try {
        const sql = `
          INSERT INTO route_analysis (
            start_latitude, start_longitude, destination_latitude, destination_longitude,
            start_name, destination_name, risk_score, risk_level, navigation_status,
            selected_route_risk, recommended_route_risk, decision, recommendation
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
          start.lat,
          start.lng,
          destination.lat,
          destination.lng,
          start.name || 'Start Location',
          destination.name || 'Destination Point',
          analysis.riskScore,
          analysis.riskLevel,
          analysis.navigationStatus,
          analysis.routeComparison.selectedRouteRisk,
          analysis.routeComparison.recommendedRouteRisk,
          analysis.decision,
          analysis.recommendation
        ];
        const dbResult = await query(sql, params);
        analysis.persistedId = dbResult.insertId;
        analysis.dbPersisted = true;
      } catch (dbErr) {
        console.warn('⚠️ [Route Controller] Database insert skipped:', dbErr.message);
        analysis.dbPersisted = false;
      }
    } else {
      analysis.dbPersisted = false;
    }

    // Include ECDIS GeoJSON export
    if (analysis.multiRoutes) {
      analysis.ecdisGeoJson = exportToECDISGeoJSON(analysis.multiRoutes);
    }

    return res.json({
      success: true,
      analysis,
      meta: {
        engine: 'POLAR-SAFE AI Level 2 Multi-Criteria Geodesic & POLARIS Engine',
        standard: 'IMO Polar Code MSC.1/Circ.1519'
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: Get Route Analysis History
 * GET /api/routes
 */
const getRoutesHistory = async (req, res, next) => {
  try {
    const isDbConnected = await checkConnection();

    if (isDbConnected) {
      const sql = 'SELECT * FROM route_analysis ORDER BY created_at DESC LIMIT 20';
      const rows = await query(sql);
      return res.json({
        count: rows.length,
        routes: rows,
        source: 'MySQL Database'
      });
    }

    // Return in-memory fallback history
    return res.json({
      count: 1,
      routes: [
        {
          id: 1,
          start_latitude: -60.2168,
          start_longitude: -45.1617,
          destination_latitude: -60.5642,
          destination_longitude: 62.7921,
          start_name: 'South Orkney Base Alpha',
          destination_name: 'Mawson Sector Target',
          risk_score: 80,
          risk_level: 'HIGH',
          navigation_status: 'CAUTION',
          selected_route_risk: 88,
          recommended_route_risk: 62,
          decision: 'AVOID HIGH-RISK AREA',
          recommendation: 'Review AI recommended route (Route B) and avoid high-density iceberg zones.',
          created_at: new Date().toISOString()
        }
      ],
      source: 'Simulated In-Memory Telemetry'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  analyzeRoute,
  getRoutesHistory
};
