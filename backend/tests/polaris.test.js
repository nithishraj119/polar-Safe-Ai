const test = require('node:test');
const assert = require('node:assert/strict');
const { calculatePOLARIS, estimateIceRegime, POLARIS_RIV_TABLE } = require('../services/polarisService');

test('POLARIS RIV Table contains valid IMO definitions for all Polar Classes', () => {
  const classes = ['PC1', 'PC2', 'PC3', 'PC4', 'PC5', 'PC6', 'PC7', 'NON_ICE'];
  classes.forEach((cls) => {
    assert.ok(POLARIS_RIV_TABLE[cls], `Missing class ${cls}`);
    assert.equal(typeof POLARIS_RIV_TABLE[cls].name, 'string');
    assert.equal(typeof POLARIS_RIV_TABLE[cls].riv.oldIce, 'number');
    assert.equal(typeof POLARIS_RIV_TABLE[cls].riv.openWater, 'number');
  });
});

test('Ice regime estimator returns 10 tenths total concentration', () => {
  const regimeLow = estimateIceRegime(20);
  const totalLow = Object.values(regimeLow).reduce((a, b) => a + b, 0);
  assert.equal(totalLow, 10, 'Regime tenths must sum to 10');

  const regimeHigh = estimateIceRegime(85);
  const totalHigh = Object.values(regimeHigh).reduce((a, b) => a + b, 0);
  assert.equal(totalHigh, 10, 'Regime tenths must sum to 10');
});

test('POLARIS evaluates Heavy Icebreaker (PC1) as Normal Operation in severe pack ice', () => {
  const result = calculatePOLARIS('PC1', 90);
  assert.ok(result.rio >= 0, `PC1 RIO should be >= 0, got ${result.rio}`);
  assert.equal(result.operationalStatus, 'NORMAL_OPERATION');
  assert.equal(result.riskLevel, 'LOW');
});

test('POLARIS evaluates Non-Ice Strengthened vessel as Operation Prohibited in heavy ice', () => {
  const result = calculatePOLARIS('NON_ICE', 80);
  assert.ok(result.rio < -10, `Non-Ice RIO should be < -10, got ${result.rio}`);
  assert.equal(result.operationalStatus, 'OPERATION_PROHIBITED');
  assert.equal(result.riskLevel, 'CRITICAL');
});

test('POLARIS evaluates PC7 in moderate ice as Elevated Operational Risk', () => {
  const result = calculatePOLARIS('PC7', 65);
  assert.ok(result.rio < 0 && result.rio >= -10, `PC7 RIO should be in elevated risk band [-10, 0), got ${result.rio}`);
  assert.equal(result.operationalStatus, 'ELEVATED_OPERATIONAL_RISK');
});
