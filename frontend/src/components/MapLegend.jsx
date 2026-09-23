import React from 'react';

export default function MapLegend() {
  return (
    <div className="map-legend-panel" aria-label="Map Visual Legend">
      <div className="legend-title">MAP LEGEND</div>
      <div className="legend-grid">
        <div className="legend-item">
          <span style={{ fontSize: '0.9rem' }}>🟢</span>
          <span>Low Risk Zone</span>
        </div>
        <div className="legend-item">
          <span style={{ fontSize: '0.9rem' }}>🟡</span>
          <span>Moderate Risk Zone</span>
        </div>
        <div className="legend-item">
          <span style={{ fontSize: '0.9rem' }}>🔴</span>
          <span>High Risk Zone</span>
        </div>
        <div className="legend-item">
          <span style={{ fontSize: '0.9rem' }}>🚢</span>
          <span>Research Vessel</span>
        </div>
        <div className="legend-item">
          <span style={{ fontSize: '0.9rem' }}>🧊</span>
          <span>Iceberg Target</span>
        </div>
        <div className="legend-item">
          <span className="legend-swatch" style={{ backgroundColor: '#ff3d4f', borderTop: '2px dashed #ff3d4f', height: '2px' }} />
          <span>🔴 Iceberg Trajectory</span>
        </div>
        <div className="legend-item">
          <span className="legend-swatch" style={{ backgroundColor: '#1683e6', borderTop: '2px dashed #38bdf8', height: '2px' }} />
          <span>🔵 Selected Route</span>
        </div>
        <div className="legend-item">
          <span className="legend-swatch" style={{ backgroundColor: '#00e676', borderTop: '2px dashed #00e676', height: '2px' }} />
          <span>🟢 Recommended Route</span>
        </div>
      </div>
    </div>
  );
}
