/**
 * POLAR-SAFE AI - Client-Side Geodesic & Multi-Route Calculator
 * Great Circle navigation, ETA, and fuel burn estimations
 */

const EARTH_RADIUS_KM = 6371.0;
const KM_TO_NM = 0.539957;

export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function calculateBearing(lat1, lon1, lat2, lon2) {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);
  return ((theta * 180) / Math.PI + 360) % 360;
}

export function interpolateGreatCircle(lat1, lon1, lat2, lon2, numPoints = 8) {
  const points = [];
  const phi1 = (lat1 * Math.PI) / 180;
  const lambda1 = (lon1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const lambda2 = (lon2 * Math.PI) / 180;

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((phi1 - phi2) / 2), 2) +
          Math.cos(phi1) * Math.cos(phi2) * Math.pow(Math.sin((lambda1 - lambda2) / 2), 2)
      )
    );

  if (d === 0) return [[lat1, lon1], [lat2, lon2]];

  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);

    const x = A * Math.cos(phi1) * Math.cos(lambda1) + B * Math.cos(phi2) * Math.cos(lambda2);
    const y = A * Math.cos(phi1) * Math.sin(lambda1) + B * Math.cos(phi2) * Math.sin(lambda2);
    const z = A * Math.sin(phi1) + B * Math.sin(phi2);

    const phiI = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lambdaI = Math.atan2(y, x);

    points.push([
      Math.round(((phiI * 180) / Math.PI) * 10000) / 10000,
      Math.round(((lambdaI * 180) / Math.PI) * 10000) / 10000
    ]);
  }

  return points;
}

export function computePathLengthNM(waypoints) {
  let totalKm = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalKm += haversineDistanceKm(
      waypoints[i][0],
      waypoints[i][1],
      waypoints[i + 1][0],
      waypoints[i + 1][1]
    );
  }
  return Math.round(totalKm * KM_TO_NM * 10) / 10;
}

export function calculateVoyageCostMetrics(distanceNM, baseSpeedKnots = 12.0, iceConcentration = 60) {
  const iceFraction = Math.max(0, Math.min(100, iceConcentration)) / 100;
  const speedReductionFactor = Math.max(0.45, 1.0 - iceFraction * 0.45);
  const effectiveSpeedKnots = Math.round(baseSpeedKnots * speedReductionFactor * 10) / 10;

  const transitHours = Math.round((distanceNM / effectiveSpeedKnots) * 10) / 10;
  const days = Math.floor(transitHours / 24);
  const remainingHours = Math.round(transitHours % 24);

  const icePowerMultiplier = 1.0 + iceFraction * 0.60;
  const fuelBurnRateMTPerDay = 18.5 * icePowerMultiplier;
  const totalFuelMT = Math.round(((transitHours / 24) * fuelBurnRateMTPerDay) * 10) / 10;
  const co2EmissionsMT = Math.round(totalFuelMT * 3.206 * 10) / 10;

  return {
    distanceNM,
    effectiveSpeedKnots,
    transitHours,
    durationFormatted: days > 0 ? `${days}d ${remainingHours}h` : `${transitHours}h`,
    totalFuelMT,
    co2EmissionsMT
  };
}

export function computeMultiRoutesClient(start, destination, seaIce = 63, nearestIceberg = 24, density = 17, vesselIceClass = 'PC3') {
  if (!start || !destination) return null;

  // Route A: Direct
  const routeAWaypoints = interpolateGreatCircle(start.lat, start.lng, destination.lat, destination.lng, 10);
  const routeADistanceNM = computePathLengthNM(routeAWaypoints);
  const routeACost = calculateVoyageCostMetrics(routeADistanceNM, 12.0, seaIce);
  const routeABaseRisk = Math.min(100, Math.round(seaIce * 0.45 + (100 - nearestIceberg) * 0.35 + density * 0.7));

  // Route B: Safe Corridor
  const midLat = (start.lat + destination.lat) / 2;
  const midLng = (start.lng + destination.lng) / 2;
  const safeBypassLat = Math.min(-54.0, midLat + 4.8);
  const safeBypassLng = midLng + 2.5;

  const leg1 = interpolateGreatCircle(start.lat, start.lng, safeBypassLat, safeBypassLng, 6);
  const leg2 = interpolateGreatCircle(safeBypassLat, safeBypassLng, destination.lat, destination.lng, 6);
  const routeBWaypoints = [...leg1, ...leg2.slice(1)];
  const routeBDistanceNM = computePathLengthNM(routeBWaypoints);
  const routeBCost = calculateVoyageCostMetrics(routeBDistanceNM, 13.5, Math.round(seaIce * 0.55));
  const routeBBaseRisk = Math.max(15, Math.round(routeABaseRisk - 26));

  // Route C: Eco Corridor
  const ecoBypassLat = Math.min(-52.5, midLat + 6.2);
  const ecoBypassLng = midLng + 4.0;
  const ecoLeg1 = interpolateGreatCircle(start.lat, start.lng, ecoBypassLat, ecoBypassLng, 5);
  const ecoLeg2 = interpolateGreatCircle(ecoBypassLat, ecoBypassLng, destination.lat, destination.lng, 5);
  const routeCWaypoints = [...ecoLeg1, ...ecoLeg2.slice(1)];
  const routeCDistanceNM = computePathLengthNM(routeCWaypoints);
  const routeCCost = calculateVoyageCostMetrics(routeCDistanceNM, 14.2, Math.round(seaIce * 0.30));
  const routeCBaseRisk = Math.max(10, Math.round(routeABaseRisk - 35));

  const safetyDelta = routeABaseRisk - routeBBaseRisk;

  return {
    vesselIceClass,
    startPoint: start,
    destinationPoint: destination,
    initialBearingDeg: Math.round(calculateBearing(start.lat, start.lng, destination.lat, destination.lng)),
    safetyDeltaPoints: safetyDelta,
    routes: {
      routeA: {
        id: 'route-a',
        code: 'ROUTE_A',
        name: 'Direct Great Circle',
        tag: 'DIRECT / HIGH ICE RISK',
        color: '#00d4ff',
        lineStyle: 'dashed',
        waypoints: routeAWaypoints,
        distanceNM: routeADistanceNM,
        effectiveSpeedKnots: routeACost.effectiveSpeedKnots,
        etaHours: routeACost.transitHours,
        durationFormatted: routeACost.durationFormatted,
        fuelConsumptionMT: routeACost.totalFuelMT,
        co2EmissionsMT: routeACost.co2EmissionsMT,
        riskScore: routeABaseRisk,
        riskLevel: routeABaseRisk > 70 ? 'CRITICAL' : routeABaseRisk > 50 ? 'HIGH' : 'MODERATE'
      },
      routeB: {
        id: 'route-b',
        code: 'ROUTE_B',
        name: 'AI Safe Recommended Corridor',
        tag: 'RECOMMENDED (IMO COMPLIANT)',
        color: '#00ff88',
        lineStyle: 'solid',
        isRecommended: true,
        waypoints: routeBWaypoints,
        distanceNM: routeBDistanceNM,
        effectiveSpeedKnots: routeBCost.effectiveSpeedKnots,
        etaHours: routeBCost.transitHours,
        durationFormatted: routeBCost.durationFormatted,
        fuelConsumptionMT: routeBCost.totalFuelMT,
        co2EmissionsMT: routeBCost.co2EmissionsMT,
        riskScore: routeBBaseRisk,
        riskLevel: routeBBaseRisk <= 35 ? 'LOW' : 'MODERATE'
      },
      routeC: {
        id: 'route-c',
        code: 'ROUTE_C',
        name: 'Eco-Transit / Low-Fuel Corridor',
        tag: 'MINIMUM FUEL & EMISSIONS',
        color: '#ffb300',
        lineStyle: 'dashdot',
        waypoints: routeCWaypoints,
        distanceNM: routeCDistanceNM,
        effectiveSpeedKnots: routeCCost.effectiveSpeedKnots,
        etaHours: routeCCost.transitHours,
        durationFormatted: routeCCost.durationFormatted,
        fuelConsumptionMT: routeCCost.totalFuelMT,
        co2EmissionsMT: routeCCost.co2EmissionsMT,
        riskScore: routeCBaseRisk,
        riskLevel: 'LOW'
      }
    }
  };
}
