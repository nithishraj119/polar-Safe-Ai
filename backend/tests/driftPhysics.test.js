const test = require('node:test');
const assert = require('node:assert/strict');
const {
  getCoriolisParameter,
  calculateIcebergDriftVelocity,
  calculateIcebergDecay,
  forecastIcebergTrajectory
} = require('../services/icebergDriftService');

test('Coriolis parameter is negative in Southern Hemisphere and zero at equator', () => {
  const fSouth = getCoriolisParameter(-65.0);
  const fEquator = getCoriolisParameter(0.0);
  const fNorth = getCoriolisParameter(65.0);

  assert.ok(fSouth < 0, 'Coriolis parameter in Antarctica must be negative');
  assert.ok(Math.abs(fEquator) < 1e-10, 'Coriolis parameter at equator must be ~0');
  assert.ok(fNorth > 0, 'Coriolis parameter in Arctic must be positive');
});

test('calculateIcebergDriftVelocity returns realistic Antarctic drift speeds (0.5 to 3.5 knots)', () => {
  const drift = calculateIcebergDriftVelocity({
    lat: -63.5,
    windSpeedKnots: 25.0,
    windDirDeg: 60.0,
    currentSpeedKnots: 0.8,
    currentDirDeg: 45.0,
    draftMeters: 220
  });

  assert.ok(drift.speedKnots >= 0.4 && drift.speedKnots <= 3.5, `Speed ${drift.speedKnots} should be in realistic range`);
  assert.ok(drift.headingDeg >= 0 && drift.headingDeg <= 360, `Heading ${drift.headingDeg} must be valid bearing`);
});

test('calculateIcebergDecay models higher melt rate in warmer waters', () => {
  const coldDecay = calculateIcebergDecay(-1.8, 1.5, 100);
  const warmDecay = calculateIcebergDecay(2.0, 3.5, 100);

  assert.ok(warmDecay.basalMeltRateMetersPerDay > coldDecay.basalMeltRateMetersPerDay, 'Warm water must accelerate melt');
  assert.ok(warmDecay.calvingRisk > coldDecay.calvingRisk, 'Warm water + high waves must increase calving risk');
});

test('forecastIcebergTrajectory generates 5 timesteps (0, 6, 12, 24, 48h) and expanding uncertainty cones', () => {
  const sampleIceberg = {
    id: 101,
    name: 'Test Iceberg A-99',
    latitude: -62.5,
    longitude: -45.0,
    drift_speed_knots: 1.5,
    estimated_draft_meters: 200,
    size_km2: 120
  };

  const forecast = forecastIcebergTrajectory(sampleIceberg, {
    windSpeedKnots: 20,
    currentSpeedKnots: 0.5
  });

  assert.equal(forecast.forecastPoints.length, 5, 'Must generate 5 forecast timesteps');
  assert.equal(forecast.uncertaintyCones.length, 4, 'Must generate 4 future uncertainty cones (+6h, +12h, +24h, +48h)');
  
  // Uncertainty radius must increase monotonically over time
  for (let i = 0; i < forecast.uncertaintyCones.length - 1; i++) {
    assert.ok(
      forecast.uncertaintyCones[i + 1].radiusMeters > forecast.uncertaintyCones[i].radiusMeters,
      'Uncertainty radius must expand over time'
    );
  }
});
