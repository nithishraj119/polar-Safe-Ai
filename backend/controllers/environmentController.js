const { query, checkConnection } = require('../config/db');
const { fetchAntarcticMarineWeather } = require('../services/openMeteoService');

// In-memory simulated baseline
let currentEnvironment = {
  seaIceConcentration: 63,
  nearestIcebergDistance: 24,
  icebergDensity: 17,
  windSpeedKnots: 22.4,
  seaSurfaceTempC: -1.8,
  visibilityKm: 6.5,
  waveHeightMeters: 2.5
};

const getEnvironment = async (req, res, next) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : -62.0;
    const lng = req.query.lng ? parseFloat(req.query.lng) : -40.0;

    // Fetch live weather data from Open-Meteo
    const liveWeather = await fetchAntarcticMarineWeather(lat, lng);

    const isDbConnected = await checkConnection();

    if (isDbConnected) {
      const sql = 'SELECT * FROM environment_data ORDER BY id DESC LIMIT 1';
      const rows = await query(sql);
      if (rows && rows.length > 0) {
        const row = rows[0];
        return res.json({
          seaIceConcentration: row.sea_ice_concentration,
          nearestIcebergDistance: row.nearest_iceberg_distance,
          icebergDensity: row.iceberg_density,
          windSpeedKnots: parseFloat(row.wind_speed_knots) || liveWeather.wind.speedKnots,
          seaSurfaceTempC: parseFloat(row.sea_surface_temp_c) || liveWeather.sea.surfaceTempC,
          visibilityKm: parseFloat(row.visibility_km) || liveWeather.atmosphere.visibilityKm,
          liveWeather,
          source: 'MySQL Database + Open-Meteo Marine API'
        });
      }
    }

    return res.json({
      ...currentEnvironment,
      liveWeather,
      source: 'Simulated In-Memory Feed + Open-Meteo Marine API'
    });
  } catch (err) {
    next(err);
  }
};

const updateEnvironment = async (req, res, next) => {
  try {
    const {
      seaIceConcentration,
      nearestIcebergDistance,
      icebergDensity,
      windSpeedKnots,
      seaSurfaceTempC,
      visibilityKm
    } = req.body;

    if (seaIceConcentration !== undefined) currentEnvironment.seaIceConcentration = Number(seaIceConcentration);
    if (nearestIcebergDistance !== undefined) currentEnvironment.nearestIcebergDistance = Number(nearestIcebergDistance);
    if (icebergDensity !== undefined) currentEnvironment.icebergDensity = Number(icebergDensity);
    if (windSpeedKnots !== undefined) currentEnvironment.windSpeedKnots = Number(windSpeedKnots);
    if (seaSurfaceTempC !== undefined) currentEnvironment.seaSurfaceTempC = Number(seaSurfaceTempC);
    if (visibilityKm !== undefined) currentEnvironment.visibilityKm = Number(visibilityKm);

    const isDbConnected = await checkConnection();

    if (isDbConnected) {
      const sql = `
        INSERT INTO environment_data (
          sea_ice_concentration, nearest_iceberg_distance, iceberg_density,
          wind_speed_knots, sea_surface_temp_c, visibility_km
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
      const params = [
        currentEnvironment.seaIceConcentration,
        currentEnvironment.nearestIcebergDistance,
        currentEnvironment.icebergDensity,
        currentEnvironment.windSpeedKnots,
        currentEnvironment.seaSurfaceTempC,
        currentEnvironment.visibilityKm
      ];
      await query(sql, params);
    }

    return res.json({
      success: true,
      message: 'Environmental telemetry updated successfully.',
      environment: currentEnvironment
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEnvironment,
  updateEnvironment
};
