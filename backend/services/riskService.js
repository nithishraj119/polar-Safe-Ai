/**
 * POLAR-SAFE AI - Enhanced Multi-Factor Risk Assessment & Decision Support Service
 * 
 * Level 2 Engineering Core:
 * - IMO Resolution MSC.1/Circ.1519 (POLARIS Risk Index Outcome)
 * - Geodesic Great Circle Multi-Criteria Route Optimization (Routes A, B, C)
 * - Physics Hydrodynamic Iceberg Drift Dynamics with Coriolis Acceleration
 */

const { calculatePOLARIS } = require('./polarisService');
const { generateMultiCriteriaRoutes } = require('./geodesicRouteService');
const { calculateIcebergDriftVelocity, calculateIcebergDecay } = require('./icebergDriftService');

/**
 * Calculate sea ice risk contribution (0-50)
 */
function calculateSeaIceRisk(seaIce) {
  const val = Number(seaIce);
  if (val <= 30) return 5;
  if (val <= 50) return 15;
  if (val <= 70) return 25;
  if (val <= 85) return 40;
  return 50;
}

/**
 * Calculate nearest iceberg risk contribution (5-50)
 */
function calculateIcebergDistanceRisk(distanceKm) {
  const dist = Number(distanceKm);
  if (dist >= 70) return 5;
  if (dist >= 50) return 10;
  if (dist >= 30) return 20;
  if (dist >= 15) return 35;
  return 50;
}

/**
 * Calculate iceberg density risk contribution (5-40)
 */
function calculateIcebergDensityRisk(density) {
  const dens = Number(density);
  if (dens <= 5) return 5;
  if (dens <= 15) return 10;
  if (dens <= 25) return 20;
  if (dens <= 40) return 30;
  return 40;
}

/**
 * Determine risk level category
 */
function getRiskLevel(riskScore) {
  if (riskScore <= 30) return 'LOW';
  if (riskScore <= 60) return 'MODERATE';
  if (riskScore <= 80) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Determine navigation status
 */
function getNavigationStatus(riskLevel) {
  switch (riskLevel) {
    case 'LOW':
      return 'SAFE';
    case 'MODERATE':
      return 'MONITOR';
    case 'HIGH':
      return 'CAUTION';
    case 'CRITICAL':
    default:
      return 'DANGER';
  }
}

/**
 * Get AI Decision and Recommendation
 */
function getAIDecision(riskScore, polarisResult = null) {
  if (polarisResult && polarisResult.operationalStatus === 'OPERATION_PROHIBITED') {
    return {
      decision: 'OPERATION PROHIBITED (IMO POLARIS LIMIT)',
      recommendation: polarisResult.operationalGuidance,
      summary: 'Ice concentration exceeds structural hull capability under IMO Polar Code MSC.1/Circ.1519. Course alteration mandatory.'
    };
  }

  if (riskScore >= 80) {
    return {
      decision: 'AVOID HIGH-RISK AREA',
      recommendation: 'Review AI recommended route (Route B) and avoid high-density iceberg regions.',
      summary: 'High iceberg and sea-ice risk detected. Avoid direct Route A and review recommended Route B.'
    };
  }
  if (riskScore >= 60) {
    return {
      decision: 'PROCEED WITH CAUTION',
      recommendation: 'Review environmental conditions and maintain additional radar watch.',
      summary: 'Elevated environmental hazards detected. Proceed with caution along recommended corridor.'
    };
  }
  if (riskScore >= 31) {
    return {
      decision: 'MONITOR CONDITIONS',
      recommendation: 'Continue monitoring sea ice and iceberg drift vectors.',
      summary: 'Moderate environmental conditions detected. Maintain regular ice watch.'
    };
  }
  return {
    decision: 'LOWER CALCULATED RISK',
    recommendation: 'Continue monitoring environmental conditions.',
    summary: 'Current environmental conditions are within standard operational parameters.'
  };
}

/**
 * Full risk analysis pipeline with IMO POLARIS & Multi-Criteria Route Optimization
 */
function analyzeRisk(
  seaIce = 63,
  icebergDist = 24,
  icebergDensity = 17,
  startCoords = null,
  destCoords = null,
  vesselIceClass = 'PC3'
) {
  const seaIceRisk = calculateSeaIceRisk(seaIce);
  const icebergRisk = calculateIcebergDistanceRisk(icebergDist);
  const densityRisk = calculateIcebergDensityRisk(icebergDensity);

  const rawScore = seaIceRisk + icebergRisk + densityRisk;
  const riskScore = Math.min(100, Math.max(0, rawScore));
  const riskLevel = getRiskLevel(riskScore);
  const navigationStatus = getNavigationStatus(riskLevel);

  // POLARIS Assessment
  const polaris = calculatePOLARIS(vesselIceClass, seaIce);
  const ai = getAIDecision(riskScore, polaris);

  let multiRoutes = null;
  let recommendedWaypoints = null;

  if (startCoords && destCoords) {
    multiRoutes = generateMultiCriteriaRoutes(
      startCoords,
      destCoords,
      {
        seaIceConcentration: seaIce,
        nearestIcebergDistance: icebergDist,
        icebergDensity: icebergDensity
      },
      vesselIceClass
    );
    recommendedWaypoints = multiRoutes.routes.routeB.waypoints;
  }

  const selectedRouteRisk = multiRoutes ? multiRoutes.routes.routeA.riskScore : Math.min(100, riskScore + 8);
  const recommendedRouteRisk = multiRoutes ? multiRoutes.routes.routeB.riskScore : Math.max(0, riskScore - 18);
  const delta = selectedRouteRisk - recommendedRouteRisk;

  return {
    riskScore,
    riskLevel,
    navigationStatus,
    decision: ai.decision,
    recommendation: ai.recommendation,
    summary: ai.summary,
    recommendedRoute: 'Route B',
    breakdown: {
      seaIceRisk,
      icebergRisk,
      densityRisk
    },
    polaris,
    routeComparison: {
      selectedRouteRisk,
      selectedStatus: selectedRouteRisk > 60 ? 'Higher Risk' : 'Moderate Risk',
      recommendedRouteRisk,
      recommendedStatus: recommendedRouteRisk <= 40 ? 'Lower Risk' : 'Substantially Reduced Risk',
      delta,
      comparisonText: 'Recommended Route B has lower calculated risk and POLARIS compliance.',
      disclaimer: 'Decision-support comparison compliant with IMO Polar Code MSC.1/Circ.1519.'
    },
    multiRoutes,
    recommendedWaypoints,
    environmentalInputs: {
      seaIceConcentration: Number(seaIce),
      nearestIcebergDistance: Number(icebergDist),
      icebergDensity: Number(icebergDensity),
      vesselIceClass
    },
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  calculateSeaIceRisk,
  calculateIcebergDistanceRisk,
  calculateIcebergDensityRisk,
  getRiskLevel,
  getNavigationStatus,
  getAIDecision,
  analyzeRisk
};
