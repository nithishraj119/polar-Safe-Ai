/**
 * POLAR-SAFE AI - Confidence Score Calculator
 * 
 * Calculates AI analysis confidence based on existing environmental data.
 * This is SEPARATE from the risk score:
 *   - Risk Score = how dangerous the conditions are
 *   - Confidence Score = how reliable the AI's analysis/data is
 *
 * Inputs are the same environmental values already tracked in App.jsx state.
 * The confidence is derived from data quality heuristics, NOT from danger level.
 */

/**
 * Satellite image confidence:
 *  - Better when sea-ice concentration is not at extreme values (0 or 100),
 *    because mid-range values are easier for satellite classification.
 *  - Optimal detection range is 20–80% ice cover.
 */
export function calculateSatelliteConfidence(seaIce) {
  const val = Number(seaIce);
  // Mid-range ice values give clearest satellite contrast
  const distFromMidpoint = Math.abs(val - 50);
  // 0 distance from 50 → 98%, 50 distance → 78%
  return Math.round(98 - (distFromMidpoint / 50) * 20);
}

/**
 * Environmental data confidence:
 *  - Higher when all three environmental parameters are within
 *    well-calibrated sensor ranges (not extreme edges).
 *  - Sensor accuracy degrades at the extremes of each parameter.
 */
export function calculateEnvironmentalConfidence(seaIce, nearestIceberg, icebergDensity) {
  const ice = Number(seaIce);
  const dist = Number(nearestIceberg);
  const density = Number(icebergDensity);

  // Sea-ice sensor confidence: extreme values have more noise
  const iceConf = ice >= 10 && ice <= 90 ? 95 : 82;

  // Distance sensor confidence: very close objects cause radar clutter
  const distConf = dist >= 10 ? 94 : 75 + (dist / 10) * 19;

  // Density sensor confidence: high density causes occlusion
  const densConf = density <= 30 ? 93 : 93 - ((density - 30) / 20) * 15;

  return Math.round((iceConf + distConf + densConf) / 3);
}

/**
 * Iceberg detection confidence:
 *  - Higher when iceberg distance is in a clear detection range (>5 km)
 *  - Lower when density is extremely high (detection overlap)
 */
export function calculateIcebergDetectionConfidence(nearestIceberg, icebergDensity) {
  const dist = Number(nearestIceberg);
  const density = Number(icebergDensity);

  // Distance-based detection: farther = clearer radar return up to a point
  let distScore;
  if (dist >= 30) distScore = 97;
  else if (dist >= 15) distScore = 92;
  else if (dist >= 5) distScore = 85;
  else distScore = 72;

  // Density-based detection: too many targets cause classification noise
  let densScore;
  if (density <= 10) densScore = 97;
  else if (density <= 25) densScore = 92;
  else if (density <= 40) densScore = 84;
  else densScore = 76;

  return Math.round((distScore + densScore) / 2);
}

/**
 * Data freshness:
 *  - Simulated freshness based on how much the data deviates from
 *    baseline calibration values (the app defaults).
 *  - When values are near defaults, data is "fresh" (recently calibrated).
 *  - As values deviate, freshness drops (simulating sensor drift).
 */
export function calculateDataFreshness(seaIce, nearestIceberg, icebergDensity) {
  // Default baseline values from App.jsx initial state
  const BASELINE = { seaIce: 63, nearestIceberg: 24, icebergDensity: 17 };

  const iceDrift = Math.abs(Number(seaIce) - BASELINE.seaIce) / 100;
  const distDrift = Math.abs(Number(nearestIceberg) - BASELINE.nearestIceberg) / 100;
  const densDrift = Math.abs(Number(icebergDensity) - BASELINE.icebergDensity) / 50;

  const avgDrift = (iceDrift + distDrift + densDrift) / 3;

  // 0 drift → 96%, max drift → 72%
  return Math.round(96 - avgDrift * 24);
}

/**
 * Route analysis confidence:
 *  - Based on how well-defined the risk boundaries are.
 *  - Extreme risk scores (very high or very low) give higher confidence
 *    because the decision is clear-cut.
 *  - Mid-range risk scores (around 40-60) give lower confidence because
 *    the risk is ambiguous.
 */
export function calculateRouteAnalysisConfidence(riskScore) {
  const score = Number(riskScore);
  const distFromAmbiguity = Math.abs(score - 50);
  // 50 away from 50 → 97%, 0 away from 50 → 80%
  return Math.round(80 + (distFromAmbiguity / 50) * 17);
}

/**
 * Overall confidence: weighted average of all sub-scores
 */
export function calculateOverallConfidence(satellite, environmental, icebergDetection, freshness, routeAnalysis) {
  const weighted = (
    satellite * 0.20 +
    environmental * 0.25 +
    icebergDetection * 0.20 +
    freshness * 0.15 +
    routeAnalysis * 0.20
  );
  return Math.round(weighted);
}

/**
 * Confidence level label
 */
export function getConfidenceLevel(score) {
  if (score >= 90) return 'HIGH CONFIDENCE';
  if (score >= 75) return 'GOOD CONFIDENCE';
  if (score >= 50) return 'MODERATE CONFIDENCE';
  return 'LOW CONFIDENCE';
}

/**
 * Confidence level color for the status indicators
 * Uses the existing status color variables from the design system
 */
export function getConfidenceColor(score) {
  if (score >= 90) return '#22c55e'; // --status-safe
  if (score >= 75) return '#38bdf8'; // blue
  if (score >= 50) return '#eab308'; // --status-caution
  return '#ef4444'; // --status-danger
}

/**
 * Master function: calculate all confidence metrics from existing app data
 */
export function evaluateConfidence(seaIce, nearestIceberg, icebergDensity, riskScore) {
  const satellite = calculateSatelliteConfidence(seaIce);
  const environmental = calculateEnvironmentalConfidence(seaIce, nearestIceberg, icebergDensity);
  const icebergDetection = calculateIcebergDetectionConfidence(nearestIceberg, icebergDensity);
  const freshness = calculateDataFreshness(seaIce, nearestIceberg, icebergDensity);
  const routeAnalysis = calculateRouteAnalysisConfidence(riskScore);
  const overall = calculateOverallConfidence(satellite, environmental, icebergDetection, freshness, routeAnalysis);
  const level = getConfidenceLevel(overall);
  const color = getConfidenceColor(overall);

  return {
    overall,
    level,
    color,
    satellite,
    environmental,
    icebergDetection,
    freshness,
    routeAnalysis
  };
}
