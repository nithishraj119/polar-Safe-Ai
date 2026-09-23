/**
 * POLAR-SAFE AI - Client-Side Risk Calculator
 * Exact mirror of backend transparent rule-based scoring
 */

export function calculateSeaIceRisk(seaIce) {
  const val = Number(seaIce);
  if (val <= 30) return 5;
  if (val <= 50) return 15;
  if (val <= 70) return 25;
  if (val <= 85) return 40;
  return 50;
}

export function calculateIcebergDistanceRisk(distanceKm) {
  const dist = Number(distanceKm);
  if (dist >= 70) return 5;
  if (dist >= 50) return 10;
  if (dist >= 30) return 20;
  if (dist >= 15) return 35;
  return 50;
}

export function calculateIcebergDensityRisk(density) {
  const dens = Number(density);
  if (dens <= 5) return 5;
  if (dens <= 15) return 10;
  if (dens <= 25) return 20;
  if (dens <= 40) return 30;
  return 40;
}

export function getRiskLevel(riskScore) {
  if (riskScore <= 30) return 'LOW';
  if (riskScore <= 60) return 'MODERATE';
  if (riskScore <= 80) return 'HIGH';
  return 'CRITICAL';
}

export function getNavigationStatus(riskLevel) {
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

export function getAIDecision(riskScore) {
  if (riskScore >= 80) {
    return {
      decision: 'AVOID HIGH-RISK AREA',
      recommendation: 'Review AI recommended route and avoid high-density iceberg regions.',
      summary: 'High iceberg and sea-ice risk detected. Avoid the current route and review the recommended route.'
    };
  }
  if (riskScore >= 60) {
    return {
      decision: 'PROCEED WITH CAUTION',
      recommendation: 'Review environmental conditions and maintain additional clearance from hazards.',
      summary: 'Elevated environmental hazards detected. Proceed with caution and review the recommended route.'
    };
  }
  if (riskScore >= 31) {
    return {
      decision: 'MONITOR CONDITIONS',
      recommendation: 'Continue monitoring sea ice and iceberg conditions.',
      summary: 'Moderate environmental conditions detected. Continue monitoring before proceeding.'
    };
  }
  return {
    decision: 'LOWER CALCULATED RISK',
    recommendation: 'Continue monitoring environmental conditions.',
    summary: 'Current environmental conditions are suitable for continued monitoring.'
  };
}

export function computeRouteComparison(baseRisk) {
  const selectedRouteRisk = Math.min(100, Math.max(0, baseRisk + 8));
  const recommendedRouteRisk = Math.min(100, Math.max(0, baseRisk - 18));
  const delta = selectedRouteRisk - recommendedRouteRisk;

  return {
    selectedRouteRisk,
    selectedStatus: selectedRouteRisk > 60 ? 'Higher Risk' : 'Moderate Risk',
    recommendedRouteRisk,
    recommendedStatus: recommendedRouteRisk <= 40 ? 'Lower Risk' : 'Substantially Reduced Risk',
    delta,
    comparisonText: 'Recommended route has lower calculated risk.',
    disclaimer: 'Calculated decision-support comparison only. Does not guarantee safe navigation.'
  };
}

export function calculateWaypoints(start, destination) {
  if (!start || !destination) return null;
  const midLat = (start.lat + destination.lat) / 2;
  const midLng = (start.lng + destination.lng) / 2;

  // Move latitude northward (closer to 0) toward open water in southern hemisphere
  const safeLat = Math.min(-54, midLat + 4.5);
  const safeLng = midLng + 2.0;

  return [
    [start.lat, start.lng],
    [safeLat, safeLng],
    [destination.lat, destination.lng]
  ];
}

export function evaluateFullRisk(seaIce, icebergDist, density, start = null, destination = null) {
  const seaIceRisk = calculateSeaIceRisk(seaIce);
  const icebergRisk = calculateIcebergDistanceRisk(icebergDist);
  const densityRisk = calculateIcebergDensityRisk(density);

  const rawScore = seaIceRisk + icebergRisk + densityRisk;
  const riskScore = Math.min(100, Math.max(0, rawScore));
  const riskLevel = getRiskLevel(riskScore);
  const navigationStatus = getNavigationStatus(riskLevel);
  const ai = getAIDecision(riskScore);
  const routeComparison = computeRouteComparison(riskScore);
  const waypoints = calculateWaypoints(start, destination);

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
    routeComparison,
    recommendedWaypoints: waypoints
  };
}
