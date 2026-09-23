import React from 'react';

export default function EnvironmentalMonitoring({
  seaIce = 63,
  nearestIceberg = 24,
  icebergDensity = 17
}) {
  return (
    <section className="polar-card" aria-labelledby="env-mon-title" style={{ marginTop: '1.5rem' }}>
      <div className="section-header">
        <h2 id="env-mon-title" className="section-title">
          <span>🌡</span> Environmental Monitoring
        </h2>
        <span className="card-subtitle" style={{ margin: 0 }}>
          Direct Real-Time Sensor Telemetry
        </span>
      </div>

      <div className="env-monitoring-grid">
        {/* Metric 1 */}
        <div className="env-metric-card">
          <div className="env-icon-box">🌊</div>
          <div className="env-metric-details">
            <span className="env-metric-title">Sea-Ice Concentration</span>
            <span className="env-metric-num">{seaIce}%</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Optical / Synthetic Aperture Radar
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="env-metric-card">
          <div className="env-icon-box">🧊</div>
          <div className="env-metric-details">
            <span className="env-metric-title">Nearest Iceberg Distance</span>
            <span className="env-metric-num">{nearestIceberg} km</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Proximity Sonar / Marine Radar
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="env-metric-card">
          <div className="env-icon-box">📊</div>
          <div className="env-metric-details">
            <span className="env-metric-title">Iceberg Density</span>
            <span className="env-metric-num">{icebergDensity}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Tracked Targets per 50nm Sector
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
