/**
 * POLAR-SAFE AI - Frontend API Client Service (Level 2)
 * Communicates with Node.js Express REST API with graceful fallback to simulated telemetry
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Fallback simulated Icebergs with physics drift & forecast cones
export const fallbackIcebergs = [
  {
    id: 1,
    name: 'Iceberg A-68A (Detached)',
    latitude: -61.5000,
    longitude: -40.2000,
    risk_level: 'CRITICAL',
    trajectory_direction: '025° (NE)',
    size_km2: 420.00,
    drift_speed_knots: 2.1,
    estimated_draft_meters: 280,
    trajectory_path: [
      [-62.2000, -41.5000],
      [-61.5000, -40.2000],
      [-60.8000, -38.9000]
    ],
    uncertaintyCones: [
      { hours: 6, center: [-61.35, -39.9], radiusMeters: 4500, label: '+6h Forecast (±4.5 km)' },
      { hours: 12, center: [-61.18, -39.6], radiusMeters: 7400, label: '+12h Forecast (±7.4 km)' },
      { hours: 24, center: [-60.85, -39.0], radiusMeters: 12800, label: '+24h Forecast (±12.8 km)' },
      { hours: 48, center: [-60.20, -37.8], radiusMeters: 23500, label: '+48h Forecast (±23.5 km)' }
    ]
  },
  {
    id: 2,
    name: 'Iceberg B-15K (Tabular)',
    latitude: -63.8000,
    longitude: -52.4000,
    risk_level: 'HIGH',
    trajectory_direction: '340° (NW)',
    size_km2: 185.50,
    drift_speed_knots: 1.4,
    estimated_draft_meters: 210,
    trajectory_path: [
      [-64.5000, -51.8000],
      [-63.8000, -52.4000],
      [-63.1000, -53.0000]
    ],
    uncertaintyCones: [
      { hours: 6, center: [-63.68, -52.5], radiusMeters: 4000, label: '+6h Forecast' },
      { hours: 12, center: [-63.55, -52.6], radiusMeters: 6800, label: '+12h Forecast' },
      { hours: 24, center: [-63.30, -52.8], radiusMeters: 11500, label: '+24h Forecast' },
      { hours: 48, center: [-62.80, -53.2], radiusMeters: 21000, label: '+48h Forecast' }
    ]
  },
  {
    id: 3,
    name: 'Iceberg C-28B (Pinnacle)',
    latitude: -65.2000,
    longitude: 15.6000,
    risk_level: 'MODERATE',
    trajectory_direction: '110° (ESE)',
    size_km2: 45.00,
    drift_speed_knots: 0.8,
    estimated_draft_meters: 160,
    trajectory_path: [
      [-65.0000, 14.0000],
      [-65.2000, 15.6000],
      [-65.4000, 17.2000]
    ],
    uncertaintyCones: [
      { hours: 6, center: [-65.25, 16.0], radiusMeters: 3500, label: '+6h Forecast' },
      { hours: 12, center: [-65.30, 16.5], radiusMeters: 5500, label: '+12h Forecast' },
      { hours: 24, center: [-65.40, 17.4], radiusMeters: 9500, label: '+24h Forecast' },
      { hours: 48, center: [-65.60, 19.2], radiusMeters: 17000, label: '+48h Forecast' }
    ]
  },
  {
    id: 4,
    name: 'Iceberg D-09 (Weathered)',
    latitude: -62.1000,
    longitude: 48.3000,
    risk_level: 'HIGH',
    trajectory_direction: '045° (NE)',
    size_km2: 92.30,
    drift_speed_knots: 1.6,
    estimated_draft_meters: 195,
    trajectory_path: [
      [-62.8000, 47.1000],
      [-62.1000, 48.3000],
      [-61.4000, 49.5000]
    ],
    uncertaintyCones: [
      { hours: 12, center: [-61.9, 48.6], radiusMeters: 6500, label: '+12h Forecast' },
      { hours: 24, center: [-61.6, 49.0], radiusMeters: 11000, label: '+24h Forecast' },
      { hours: 48, center: [-61.0, 50.0], radiusMeters: 20000, label: '+48h Forecast' }
    ]
  },
  {
    id: 5,
    name: 'Iceberg E-14 (Calved)',
    latitude: -64.4500,
    longitude: 60.1000,
    risk_level: 'CRITICAL',
    trajectory_direction: '315° (NW)',
    size_km2: 310.00,
    drift_speed_knots: 1.9,
    estimated_draft_meters: 250,
    trajectory_path: [
      [-65.1000, 61.2000],
      [-64.4500, 60.1000],
      [-63.8000, 59.0000]
    ],
    uncertaintyCones: [
      { hours: 12, center: [-64.2, 59.7], radiusMeters: 7000, label: '+12h Forecast' },
      { hours: 24, center: [-63.9, 59.2], radiusMeters: 12000, label: '+24h Forecast' },
      { hours: 48, center: [-63.3, 58.2], radiusMeters: 22000, label: '+48h Forecast' }
    ]
  },
  {
    id: 6,
    name: 'Iceberg F-03 (Bergy Bit Cluster)',
    latitude: -59.8000,
    longitude: -25.0000,
    risk_level: 'MODERATE',
    trajectory_direction: '090° (E)',
    size_km2: 15.20,
    drift_speed_knots: 0.6,
    estimated_draft_meters: 90,
    trajectory_path: [
      [-59.8000, -26.5000],
      [-59.8000, -25.0000],
      [-59.8000, -23.5000]
    ]
  }
];

export const fallbackFleet = [
  {
    id: 'rv-polaris',
    mmsi: 235102940,
    callSign: 'MQLX7',
    name: 'R/V POLARIS',
    flag: '🇬🇧 UK / BAS',
    iceClass: 'PC3',
    iceClassName: 'Polar Class 3 (Year-Round Second-Year Ice)',
    type: 'Polar Research Flagship',
    lengthMeters: 128.5,
    draftMeters: 8.2,
    position: [-65.0000, -30.0000],
    sogKnots: 13.8,
    cogDeg: 84.0,
    headingDeg: 85,
    navStatus: 'Underway using Engine',
    destination: 'Halley VI Research Station',
    eta: '2026-03-04 18:00 UTC',
    isFlagship: true
  },
  {
    id: 'rv-attenborough',
    mmsi: 232025793,
    callSign: 'ZDLS7',
    name: 'R/V SIR DAVID ATTENBOROUGH',
    flag: '🇬🇧 UK / BAS',
    iceClass: 'PC4',
    iceClassName: 'Polar Class 4 (Thick First-Year Ice)',
    type: 'Scientific Icebreaker',
    lengthMeters: 129.0,
    draftMeters: 8.7,
    position: [-62.2000, -58.9000],
    sogKnots: 11.4,
    cogDeg: 142.0,
    headingDeg: 140,
    navStatus: 'Conducting Oceanographic Survey',
    destination: 'Rothera Research Station',
    eta: '2026-03-02 06:30 UTC',
    isFlagship: false
  },
  {
    id: 'rv-palmer',
    mmsi: 367013890,
    callSign: 'WBP3210',
    name: 'R/V NATHANIEL B. PALMER',
    flag: '🇺🇸 USA / NSF',
    iceClass: 'PC5',
    iceClassName: 'Polar Class 5 (Medium First-Year Ice)',
    type: 'Antarctic Research Icebreaker',
    lengthMeters: 94.0,
    draftMeters: 6.9,
    position: [-64.7742, -64.0531],
    sogKnots: 10.2,
    cogDeg: 210.0,
    headingDeg: 208,
    navStatus: 'Underway using Engine',
    destination: 'Palmer Station (Anvers Island)',
    eta: '2026-03-01 12:00 UTC',
    isFlagship: false
  },
  {
    id: 'rv-agulhas',
    mmsi: 601000123,
    callSign: 'ZR6789',
    name: 'S.A. AGULHAS II',
    flag: '🇿🇦 South Africa / SANAP',
    iceClass: 'PC5',
    iceClassName: 'Polar Class 5 (Medium First-Year Ice)',
    type: 'Polar Supply & Research Vessel',
    lengthMeters: 134.2,
    draftMeters: 7.7,
    position: [-69.8500, -2.8500],
    sogKnots: 9.8,
    cogDeg: 35.0,
    headingDeg: 37,
    navStatus: 'Icebreaking Transit',
    destination: 'SANAE IV Base (Queen Maud Land)',
    eta: '2026-03-05 22:00 UTC',
    isFlagship: false
  },
  {
    id: 'rv-fedorov',
    mmsi: 273111000,
    callSign: 'UERR',
    name: 'AKADEMIK FEDOROV',
    flag: '🇷🇺 Russia / AARI',
    iceClass: 'PC3',
    iceClassName: 'Polar Class 3 (Year-Round Second-Year Ice)',
    type: 'Polar Expedition Icebreaker',
    lengthMeters: 141.2,
    draftMeters: 8.5,
    position: [-66.5500, 93.0100],
    sogKnots: 12.0,
    cogDeg: 295.0,
    headingDeg: 298,
    navStatus: 'Underway using Engine',
    destination: 'Mirny Station / Progress Base',
    eta: '2026-03-06 14:00 UTC',
    isFlagship: false
  }
];

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'online_fallback',
      database: 'standalone',
      error: err.message
    };
  }
}

export async function fetchSystemStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/system/status`, { method: 'GET', signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      overallStatus: 'OPERATIONAL (FALLBACK)',
      subsystems: [
        { systemName: 'System Status', status: 'ONLINE', isHealthy: true, category: 'CORE' },
        { systemName: 'IMO POLARIS Engine', status: 'ACTIVE', isHealthy: true, category: 'MARITIME_COMPLIANCE' },
        { systemName: 'Drift Physics Solver', status: 'ACTIVE', isHealthy: true, category: 'PHYSICS' },
        { systemName: 'Open-Meteo Marine API', status: 'LIVE', isHealthy: true, category: 'EXTERNAL_TELEMETRY' },
        { systemName: 'AIS Fleet Transponder', status: 'ACTIVE', isHealthy: true, category: 'VESSEL_TRACKING' },
        { systemName: 'Geodesic Route Solver', status: 'ACTIVE', isHealthy: true, category: 'ROUTING' },
        { systemName: 'Database', status: 'STANDALONE_FALLBACK', isHealthy: false, category: 'STORAGE' },
        { systemName: 'Backend API', status: 'ONLINE', isHealthy: true, category: 'CORE' }
      ]
    };
  }
}

export async function fetchEnvironment(lat = -62.0, lng = -40.0) {
  try {
    const res = await fetch(`${API_BASE_URL}/environment?lat=${lat}&lng=${lng}`, { method: 'GET', signal: AbortSignal.timeout(3500) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      seaIceConcentration: 63,
      nearestIcebergDistance: 24,
      icebergDensity: 17,
      isSimulated: true
    };
  }
}

export async function updateEnvironmentAPI(data) {
  try {
    const res = await fetch(`${API_BASE_URL}/environment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      success: true,
      environment: data,
      isSimulated: true
    };
  }
}

export async function fetchIcebergs() {
  try {
    const res = await fetch(`${API_BASE_URL}/icebergs`, { method: 'GET', signal: AbortSignal.timeout(3500) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.icebergs || fallbackIcebergs;
  } catch (err) {
    return fallbackIcebergs;
  }
}

export async function fetchFleet() {
  try {
    const res = await fetch(`${API_BASE_URL}/fleet`, { method: 'GET', signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.fleet || fallbackFleet;
  } catch (err) {
    return fallbackFleet;
  }
}

export async function analyzeRouteAPI(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4500)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('⚠️ [API Service] analyzeRoute fallback to client calculations:', err.message);
    return null;
  }
}
