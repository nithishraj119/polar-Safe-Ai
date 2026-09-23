const { query, checkConnection } = require('../config/db');
const { forecastIcebergTrajectory, calculateIcebergDecay } = require('../services/icebergDriftService');

// Fallback curated Antarctic icebergs
const demoIcebergs = [
  {
    id: 1,
    name: 'Iceberg A-68A (Detached)',
    latitude: -61.5000,
    longitude: -40.2000,
    risk_level: 'CRITICAL',
    trajectory_direction: 'North-Northeast (025°)',
    size_km2: 420.00,
    drift_speed_knots: 2.1,
    estimated_draft_meters: 280
  },
  {
    id: 2,
    name: 'Iceberg B-15K (Tabular)',
    latitude: -63.8000,
    longitude: -52.4000,
    risk_level: 'HIGH',
    trajectory_direction: 'North-Northwest (340°)',
    size_km2: 185.50,
    drift_speed_knots: 1.4,
    estimated_draft_meters: 210
  },
  {
    id: 3,
    name: 'Iceberg C-28B (Pinnacle)',
    latitude: -65.2000,
    longitude: 15.6000,
    risk_level: 'MODERATE',
    trajectory_direction: 'East-Southeast (110°)',
    size_km2: 45.00,
    drift_speed_knots: 0.8,
    estimated_draft_meters: 160
  },
  {
    id: 4,
    name: 'Iceberg D-09 (Weathered)',
    latitude: -62.1000,
    longitude: 48.3000,
    risk_level: 'HIGH',
    trajectory_direction: 'Northeast (045°)',
    size_km2: 92.30,
    drift_speed_knots: 1.6,
    estimated_draft_meters: 195
  },
  {
    id: 5,
    name: 'Iceberg E-14 (Calved)',
    latitude: -64.4500,
    longitude: 60.1000,
    risk_level: 'CRITICAL',
    trajectory_direction: 'Northwest (315°)',
    size_km2: 310.00,
    drift_speed_knots: 1.9,
    estimated_draft_meters: 250
  },
  {
    id: 6,
    name: 'Iceberg F-03 (Bergy Bit Cluster)',
    latitude: -59.8000,
    longitude: -25.0000,
    risk_level: 'MODERATE',
    trajectory_direction: 'East (090°)',
    size_km2: 15.20,
    drift_speed_knots: 0.6,
    estimated_draft_meters: 90
  }
];

const getIcebergs = async (req, res, next) => {
  try {
    const isDbConnected = await checkConnection();
    let rawIcebergs = demoIcebergs;

    if (isDbConnected) {
      const rows = await query('SELECT * FROM icebergs ORDER BY id ASC');
      if (rows && rows.length > 0) {
        rawIcebergs = rows.map((ib) => ({
          id: ib.id,
          name: ib.name || `Iceberg #${ib.id}`,
          latitude: parseFloat(ib.latitude),
          longitude: parseFloat(ib.longitude),
          risk_level: ib.risk_level,
          trajectory_direction: ib.trajectory_direction,
          size_km2: parseFloat(ib.size_km2) || 50,
          drift_speed_knots: parseFloat(ib.drift_speed_knots) || 1.2,
          estimated_draft_meters: ib.estimated_draft_meters || 200
        }));
      }
    }

    // Enhance each iceberg with dynamic physics drift forecast & 48h uncertainty dispersion cones
    const enhancedIcebergs = rawIcebergs.map((ib) => {
      const forecast = forecastIcebergTrajectory(ib, {
        windSpeedKnots: 22.0,
        currentSpeedKnots: 0.6,
        seaSurfaceTempC: -1.8,
        waveHeightMeters: 2.2
      });

      return {
        ...ib,
        drift_speed_knots: forecast.driftVector.speedKnots,
        trajectory_direction: `${forecast.driftVector.headingDeg}° (${forecast.driftVector.headingDeg < 90 ? 'NE' : forecast.driftVector.headingDeg < 180 ? 'SE' : forecast.driftVector.headingDeg < 270 ? 'SW' : 'NW'})`,
        trajectory_path: forecast.pathCoordinates,
        forecastPoints: forecast.forecastPoints,
        uncertaintyCones: forecast.uncertaintyCones,
        decay: forecast.decay,
        physicsDrift: {
          coriolisParameter: forecast.driftVector.coriolisParameter,
          driftVectorKnots: forecast.driftVector.speedKnots,
          bearingDeg: forecast.driftVector.headingDeg
        }
      };
    });

    return res.json({
      count: enhancedIcebergs.length,
      icebergs: enhancedIcebergs,
      physicsModel: 'Hydrodynamic Drag + Coriolis Deflection + 48h Cones',
      source: isDbConnected ? 'MySQL Persistent Store (polar_safe_ai)' : 'Simulated Synthetic Aperture Radar Feed'
    });
  } catch (err) {
    console.warn('⚠️ [Iceberg Controller] Fallback error:', err.message);
    return res.json({
      count: demoIcebergs.length,
      icebergs: demoIcebergs,
      source: 'Simulated Antarctic Radar Feed (Fallback)'
    });
  }
};

module.exports = {
  getIcebergs,
  demoIcebergs
};
