import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMapEvents,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import MapLegend from './MapLegend';

// Custom DivIcons for crisp emoji markers
const createEmojiIcon = (emoji, label, color = '#38bdf8', size = 34) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
      ">
        <div style="
          background: rgba(6, 17, 31, 0.85);
          border: 1.5px solid ${color};
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${size * 0.55}px;
          box-shadow: 0 0 10px ${color}80, 0 4px 10px rgba(0,0,0,0.6);
        ">
          ${emoji}
        </div>
        ${
          label
            ? `<div style="
                background: #0d2033;
                color: #e2f1ff;
                border: 1px solid ${color};
                padding: 1px 5px;
                border-radius: 3px;
                font-size: 10px;
                font-family: 'JetBrains Mono', monospace;
                white-space: nowrap;
                margin-top: 2px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.5);
              ">${label}</div>`
            : ''
        }
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -size]
  });
};

const shipIcon = createEmojiIcon('🚢', 'R/V POLARIS', '#38bdf8', 36);
const startIcon = createEmojiIcon('📍', 'START', '#00e676', 36);
const destIcon = createEmojiIcon('🎯', 'DESTINATION', '#ff3d4f', 36);
const waypointIcon = createEmojiIcon('⚓', 'SAFE WAYPOINT', '#00e676', 30);
const icebergIconCritical = createEmojiIcon('🧊', 'CRITICAL', '#ff3d4f', 32);
const icebergIconHigh = createEmojiIcon('🧊', 'HIGH', '#ff7043', 30);
const icebergIconMod = createEmojiIcon('🧊', 'MODERATE', '#ffd600', 28);

// Helper component for map click interactions
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
}

// Auto-fit bounds when start & destination are set
function BoundsUpdater({ startPoint, destPoint, recommendedWaypoints }) {
  const map = useMap();

  useEffect(() => {
    if (startPoint && destPoint) {
      const points = [
        [startPoint.lat, startPoint.lng],
        [destPoint.lat, destPoint.lng]
      ];
      if (recommendedWaypoints) {
        recommendedWaypoints.forEach((pt) => points.push(pt));
      }
      try {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6, animate: true });
      } catch (err) {
        // Bounds fit safety catch
      }
    }
  }, [startPoint, destPoint, recommendedWaypoints, map]);

  return null;
}

const BASEMAPS = {
  satellite: {
    name: '🛰️ NASA / True Earth Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, NASA, Maxar, Earthstar Geographics'
  },
  ocean: {
    name: '🌊 Deep Ocean Bathymetry',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, GEBCO, NOAA, National Geographic'
  },
  physical: {
    name: '🏔️ Natural Earth Physical',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Natural Earth Physical'
  },
  topo: {
    name: '🗺️ Earth Topographic',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; World Topographic'
  }
};

export default function PolarMap({
  startPoint,
  destPoint,
  recommendedWaypoints,
  onMapClick,
  icebergs = []
}) {
  const [activeBasemap, setActiveBasemap] = React.useState('satellite');

  // Simulated Research Vessel Position (e.g. patrolling Bellingshausen / Weddell boundary)
  const vesselPosition = [-65.0, -30.0];

  // Simulated Polar Risk Zones
  const riskZones = [
    {
      id: 'rz-green',
      center: [-60.0, 10.0],
      radius: 420000,
      color: '#00e676',
      fillColor: '#00e676',
      name: 'Open Water Transit Zone (Low Risk)',
      desc: 'Minimal multi-year sea-ice, sporadic growlers.'
    },
    {
      id: 'rz-yellow',
      center: [-63.5, 30.0],
      radius: 520000,
      color: '#ffd600',
      fillColor: '#ffd600',
      name: 'Marginal Ice Zone (Moderate Risk)',
      desc: 'First-year pack ice (30-60% conc.), active swell fracturing.'
    },
    {
      id: 'rz-red',
      center: [-66.5, -48.0],
      radius: 650000,
      color: '#ff3d4f',
      fillColor: '#ff3d4f',
      name: 'Weddell Gyre High-Risk Iceberg Zone (Critical)',
      desc: 'High concentration of tabular icebergs and dense floes.'
    }
  ];

  // Direct Selected Route (Blue Dashed)
  const directRouteCoords = startPoint && destPoint ? [
    [startPoint.lat, startPoint.lng],
    [destPoint.lat, destPoint.lng]
  ] : null;

  // Recommended Safe Route (Green Dashed)
  const greenRouteCoords = recommendedWaypoints || (
    startPoint && destPoint ? [
      [startPoint.lat, startPoint.lng],
      [Math.min(-54, (startPoint.lat + destPoint.lat) / 2 + 4.5), (startPoint.lng + destPoint.lng) / 2 + 2.0],
      [destPoint.lat, destPoint.lng]
    ] : null
  );

  return (
    <div className="polar-card map-card" aria-label="Antarctic Navigation Map">
      <div className="map-card-header" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <div className="card-title-group" style={{ margin: 0 }}>
          <span className="card-title-icon">🌍</span>
          <span className="card-title">Antarctic Navigation Map</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
            [True Earth Satellite &amp; Bathymetry]
          </span>
        </div>

        {/* Interactive Basemap Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#071524', padding: '0.25rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          {Object.entries(BASEMAPS).map(([key, mapInfo]) => (
            <button
              key={key}
              onClick={() => setActiveBasemap(key)}
              style={{
                background: activeBasemap === key ? 'var(--primary-blue)' : 'transparent',
                color: activeBasemap === key ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '4px',
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title={`Switch basemap to ${mapInfo.name}`}
            >
              {mapInfo.name}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: '100%' }}>
          {startPoint && !destPoint && '👉 Click map to place Destination'}
          {!startPoint && '👉 Click map to place Start Location'}
          {startPoint && destPoint && '✅ Routes active & analyzed'}
        </div>
      </div>

      <MapContainer
        center={[-70, 0]}
        zoom={4}
        minZoom={2}
        maxZoom={12}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '520px' }}
      >
        {/* Dynamic Earth / Satellite / Bathymetry basemap */}
        <TileLayer
          key={activeBasemap}
          attribution={BASEMAPS[activeBasemap].attribution}
          url={BASEMAPS[activeBasemap].url}
          maxZoom={18}
        />

        <MapClickHandler onMapClick={onMapClick} />
        <BoundsUpdater
          startPoint={startPoint}
          destPoint={destPoint}
          recommendedWaypoints={greenRouteCoords}
        />

        {/* 1. Research Vessel Marker & Sonar Radar Circle */}
        <Circle
          center={vesselPosition}
          radius={220000}
          pathOptions={{
            color: '#38bdf8',
            fillColor: '#38bdf8',
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: '3, 6'
          }}
        />
        <Marker position={vesselPosition} icon={shipIcon}>
          <Popup>
            <div className="polar-popup-title">
              <span>🚢</span> RESEARCH VESSEL POLARIS
            </div>
            <div className="polar-popup-body">
              Navigation monitoring active.
              <br />
              Speed: <strong>14.2 knots</strong> | Heading: <strong>084° ENE</strong>
            </div>
            <span className="polar-popup-tag" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
              FLAGSHIP RESEARCH VESSEL
            </span>
          </Popup>
        </Marker>

        {/* 2. Risk Zones (Circles) */}
        {riskZones.map((zone) => (
          <Circle
            key={zone.id}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{
              color: zone.color,
              fillColor: zone.fillColor,
              fillOpacity: 0.16,
              weight: 2,
              dashArray: '5, 7'
            }}
          >
            <Popup>
              <div className="polar-popup-title" style={{ color: zone.color }}>
                {zone.name}
              </div>
              <div className="polar-popup-body">
                {zone.desc}
              </div>
            </Popup>
          </Circle>
        ))}

        {/* 3. Icebergs and Trajectories */}
        {icebergs.map((ib) => {
          const icon = ib.risk_level === 'CRITICAL'
            ? icebergIconCritical
            : ib.risk_level === 'HIGH'
            ? icebergIconHigh
            : icebergIconMod;

          return (
            <React.Fragment key={`iceberg-${ib.id}`}>
              {/* Iceberg Marker */}
              <Marker position={[ib.latitude, ib.longitude]} icon={icon}>
                <Popup>
                  <div className="polar-popup-title" style={{ color: '#ff7043' }}>
                    <span>🧊</span> {ib.name}
                  </div>
                  <div className="polar-popup-body">
                    <strong>Coordinates:</strong> {ib.latitude.toFixed(3)}°, {ib.longitude.toFixed(3)}°<br />
                    <strong>Risk Classification:</strong> {ib.risk_level}<br />
                    <strong>Drift Vector:</strong> {ib.trajectory_direction}<br />
                    <strong>Estimated Surface Area:</strong> {ib.size_km2} km²<br />
                    <strong>Drift Velocity:</strong> {ib.drift_speed_knots} knots
                  </div>
                  <span
                    className="polar-popup-tag"
                    style={{
                      background: ib.risk_level === 'CRITICAL' ? 'rgba(255, 61, 79, 0.25)' : 'rgba(255, 214, 0, 0.25)',
                      color: ib.risk_level === 'CRITICAL' ? '#ff3d4f' : '#ffd600'
                    }}
                  >
                    HAZARD LEVEL: {ib.risk_level}
                  </span>
                </Popup>
              </Marker>

              {/* 4. Iceberg Trajectory (Red Glowing Dashed Line) */}
              {ib.trajectory_path && (
                <Polyline
                  positions={ib.trajectory_path}
                  pathOptions={{
                    color: '#ff3344',
                    weight: 3,
                    dashArray: '6, 8',
                    opacity: 0.95
                  }}
                >
                  <Popup>
                    <div className="polar-popup-title" style={{ color: '#ff3d4f' }}>
                      🔴 Iceberg Trajectory: {ib.name}
                    </div>
                    <div className="polar-popup-body">
                      Drift forecast vector: {ib.trajectory_direction}
                    </div>
                  </Popup>
                </Polyline>
              )}
            </React.Fragment>
          );
        })}

        {/* Start Location Marker */}
        {startPoint && (
          <Marker position={[startPoint.lat, startPoint.lng]} icon={startIcon}>
            <Popup>
              <div className="polar-popup-title" style={{ color: '#00e676' }}>
                📍 START LOCATION
              </div>
              <div className="polar-popup-body mono-text">
                Lat: {startPoint.lat.toFixed(4)}°<br />
                Lng: {startPoint.lng.toFixed(4)}°
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Location Marker */}
        {destPoint && (
          <Marker position={[destPoint.lat, destPoint.lng]} icon={destIcon}>
            <Popup>
              <div className="polar-popup-title" style={{ color: '#ff3d4f' }}>
                🎯 DESTINATION
              </div>
              <div className="polar-popup-body mono-text">
                Lat: {destPoint.lat.toFixed(4)}°<br />
                Lng: {destPoint.lng.toFixed(4)}°
              </div>
            </Popup>
          </Marker>
        )}

        {/* 5. Selected Route (Neon Cyan Laser Line) */}
        {directRouteCoords && (
          <Polyline
            positions={directRouteCoords}
            pathOptions={{
              color: '#00d4ff',
              weight: 4,
              dashArray: '8, 10',
              opacity: 0.95
            }}
          >
            <Popup>
              <div className="polar-popup-title" style={{ color: '#38bdf8' }}>
                🔵 Selected Route (Direct)
              </div>
              <div className="polar-popup-body">
                Direct navigational heading from Start to Destination.
              </div>
            </Popup>
          </Polyline>
        )}

        {/* 6. AI Recommended Route (Neon Emerald Glow Line - ALWAYS VISIBLE with safe waypoint) */}
        {greenRouteCoords && (
          <>
            <Polyline
              positions={greenRouteCoords}
              pathOptions={{
                color: '#00ff88',
                weight: 5,
                dashArray: '10, 8',
                opacity: 1.0
              }}
            >
              <Popup>
                <div className="polar-popup-title" style={{ color: '#00ff88' }}>
                  🟢 AI Recommended Route (Route B)
                </div>
                <div className="polar-popup-body">
                  AI computed safe corridor avoiding concentrated iceberg zones.
                </div>
              </Popup>
            </Polyline>

            {/* Intermediate Safe Waypoint Marker */}
            {greenRouteCoords.length > 2 && (
              <Marker position={greenRouteCoords[1]} icon={waypointIcon}>
                <Popup>
                  <div className="polar-popup-title" style={{ color: '#00ff88' }}>
                    ⚓ Safe Bypass Waypoint
                  </div>
                  <div className="polar-popup-body mono-text">
                    Lat: {greenRouteCoords[1][0].toFixed(4)}°<br />
                    Lng: {greenRouteCoords[1][1].toFixed(4)}°
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        )}
      </MapContainer>

      {/* AI Orbital HUD Overlay */}
      <div className="map-ai-hud-badge">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00ff88', fontWeight: 800 }}>
          <span className="pulse-dot" style={{ backgroundColor: '#00ff88', boxShadow: '0 0 8px #00ff88' }}></span>
          <span>AI REAL-TIME EARTH TELEMETRY</span>
        </div>
        <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
          FEED: SENTINEL-3 / MODIS 4K HD | POLAR GRID SYNC: ACTIVE
        </div>
      </div>

      {/* Floating Map Legend */}
      <MapLegend />
    </div>
  );
}
