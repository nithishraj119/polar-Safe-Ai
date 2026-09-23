/**
 * Validation Middleware for POLAR-SAFE AI
 */

const validateRouteAnalysis = (req, res, next) => {
  const { start, destination } = req.body;

  if (!start || typeof start.lat !== 'number' || typeof start.lng !== 'number') {
    return res.status(400).json({
      error: 'Invalid start location. Must include numerical lat and lng properties.',
      example: { lat: -60.2168, lng: -45.1617 }
    });
  }

  if (!destination || typeof destination.lat !== 'number' || typeof destination.lng !== 'number') {
    return res.status(400).json({
      error: 'Invalid destination location. Must include numerical lat and lng properties.',
      example: { lat: -60.5642, lng: 62.7921 }
    });
  }

  if (start.lat < -90 || start.lat > 90 || destination.lat < -90 || destination.lat > 90) {
    return res.status(400).json({ error: 'Latitude must be between -90 and +90 degrees.' });
  }

  if (start.lng < -180 || start.lng > 180 || destination.lng < -180 || destination.lng > 180) {
    return res.status(400).json({ error: 'Longitude must be between -180 and +180 degrees.' });
  }

  next();
};

const validateEnvironmentUpdate = (req, res, next) => {
  const { seaIceConcentration, nearestIcebergDistance, icebergDensity } = req.body;

  if (seaIceConcentration !== undefined) {
    const val = Number(seaIceConcentration);
    if (isNaN(val) || val < 0 || val > 100) {
      return res.status(400).json({ error: 'seaIceConcentration must be a number between 0 and 100.' });
    }
  }

  if (nearestIcebergDistance !== undefined) {
    const val = Number(nearestIcebergDistance);
    if (isNaN(val) || val < 0) {
      return res.status(400).json({ error: 'nearestIcebergDistance must be a positive number.' });
    }
  }

  if (icebergDensity !== undefined) {
    const val = Number(icebergDensity);
    if (isNaN(val) || val < 0 || val > 100) {
      return res.status(400).json({ error: 'icebergDensity must be a number between 0 and 100.' });
    }
  }

  next();
};

module.exports = {
  validateRouteAnalysis,
  validateEnvironmentUpdate
};
