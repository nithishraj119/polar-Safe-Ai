const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeRisk } = require('../services/riskService');
const { getFleetVessels } = require('../services/aisService');

test('analyzeRisk returns comprehensive analysis with POLARIS and multi-route data', () => {
  const start = { lat: -60.21, lng: -45.16 };
  const dest = { lat: -60.56, lng: 62.79 };
  
  const result = analyzeRisk(70, 18, 22, start, dest, 'PC3');

  assert.ok(result.riskScore >= 0 && result.riskScore <= 100);
  assert.ok(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].includes(result.riskLevel));
  assert.ok(['SAFE', 'MONITOR', 'CAUTION', 'DANGER'].includes(result.navigationStatus));
  assert.ok(result.polaris, 'POLARIS result must be included');
  assert.ok(result.multiRoutes, 'Multi-route calculations must be included');
  assert.ok(result.recommendedWaypoints.length > 2, 'Recommended waypoints must contain intermediate bypass point');
});

test('getFleetVessels returns complete Antarctic AIS fleet', () => {
  const fleet = getFleetVessels();
  assert.ok(fleet.length >= 4, 'Fleet must contain at least 4 polar vessels');
  fleet.forEach((vessel) => {
    assert.ok(vessel.name);
    assert.ok(vessel.mmsi);
    assert.ok(vessel.iceClass);
    assert.ok(Array.isArray(vessel.position));
    assert.equal(vessel.position.length, 2);
  });
});
