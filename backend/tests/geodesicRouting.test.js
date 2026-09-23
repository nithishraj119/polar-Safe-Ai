const test = require('node:test');
const assert = require('node:assert/strict');
const {
  haversineDistanceKm,
  calculateBearing,
  interpolateGreatCircle,
  generateMultiCriteriaRoutes,
  exportToECDISGeoJSON
} = require('../services/geodesicRouteService');

test('haversineDistanceKm computes accurate Antarctic Great Circle distance', () => {
  // South Orkney (-60.2, -45.1) to Mawson (-60.5, 62.7)
  const distKm = haversineDistanceKm(-60.2, -45.1, -60.5, 62.7);
  assert.ok(distKm > 5000 && distKm < 7000, `Expected ~5800km, got ${distKm}`);
});

test('calculateBearing calculates valid compass azimuth (0-360 deg)', () => {
  const bearing = calculateBearing(-60.0, -45.0, -60.0, 45.0);
  assert.ok(bearing >= 0 && bearing <= 360, `Bearing ${bearing} must be within 0-360`);
});

test('generateMultiCriteriaRoutes produces Route A, Route B, and Route C with metrics', () => {
  const start = { lat: -60.21, lng: -45.16, name: 'South Orkney' };
  const dest = { lat: -60.56, lng: 62.79, name: 'Mawson Target' };

  const result = generateMultiCriteriaRoutes(start, dest, {
    seaIceConcentration: 65,
    nearestIcebergDistance: 20,
    icebergDensity: 15
  }, 'PC3');

  assert.ok(result.routes.routeA, 'Route A must exist');
  assert.ok(result.routes.routeB, 'Route B must exist');
  assert.ok(result.routes.routeC, 'Route C must exist');

  assert.ok(result.routes.routeA.distanceNM > 0, 'Route A distance must be > 0');
  assert.ok(result.routes.routeB.distanceNM > 0, 'Route B distance must be > 0');
  assert.ok(result.routes.routeC.fuelConsumptionMT > 0, 'Route C fuel consumption must be > 0');

  // Route B should have lower risk score than Route A
  assert.ok(
    result.routes.routeB.riskScore <= result.routes.routeA.riskScore,
    `Route B risk (${result.routes.routeB.riskScore}) should be <= Route A risk (${result.routes.routeA.riskScore})`
  );
});

test('exportToECDISGeoJSON formats compliant GeoJSON FeatureCollection', () => {
  const start = { lat: -60.21, lng: -45.16 };
  const dest = { lat: -60.56, lng: 62.79 };
  const multiRoutes = generateMultiCriteriaRoutes(start, dest, {}, 'PC3');
  const geojson = exportToECDISGeoJSON(multiRoutes);

  assert.equal(geojson.type, 'FeatureCollection');
  assert.equal(geojson.features.length, 3);
  geojson.features.forEach((feat) => {
    assert.equal(feat.type, 'Feature');
    assert.equal(feat.geometry.type, 'LineString');
    assert.ok(feat.geometry.coordinates.length > 0);
  });
});
