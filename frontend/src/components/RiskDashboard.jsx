import React from 'react';

export default function RiskDashboard({
  riskScore = 80,
  riskLevel = 'HIGH',
  seaIce = 63,
  nearestIceberg = 24,
  icebergDensity = 17,
  navigationStatus = 'CAUTION'
}) {
  const getRiskClass = (level) => {
    switch (level) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MODERATE': return 'badge-moderate';
      case 'LOW': default: return 'badge-low';
    }
  };

  const getProgressBarColor = (score) => {
    if (score >= 81) return '#ff3d4f';
    if (score >= 61) return '#ff7043';
    if (score >= 31) return '#ffd600';
    return '#00e676';
  };

  const getSeaIceCondition = (val) => {
    if (val >= 85) return 'Severe Pack Ice';
    if (val >= 70) return 'Heavy Ice';
    if (val >= 50) return 'Moderate';
    if (val >= 30) return 'Open Drift';
    return 'Very Open Water';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'DANGER': return 'badge-critical';
      case 'CAUTION': return 'badge-high';
      case 'MONITOR': return 'badge-moderate';
      case 'SAFE': default: return 'badge-low';
    }
  };

  return (
    <section className="risk-dashboard-grid" aria-label="Risk Dashboard">
      {/* CARD 1: Overall Risk */}
      <div className="metric-card">
        <div className="metric-header">
          <span>⚠</span> Overall Risk
        </div>
        <div className="metric-value-wrap">
          <div className={`metric-value ${getRiskClass(riskLevel)}`}>
            {riskLevel}
          </div>
        </div>
        <div className="metric-sub">
          <span>Evaluated Level</span>
        </div>
      </div>

      {/* CARD 2: Risk Score */}
      <div className="metric-card">
        <div className="metric-header">
          <span>📊</span> Risk Score
        </div>
        <div className="metric-value-wrap">
          <div className="metric-value" style={{ color: getProgressBarColor(riskScore) }}>
            {riskScore} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(100, Math.max(0, riskScore))}%`,
                backgroundColor: getProgressBarColor(riskScore)
              }}
            />
          </div>
        </div>
        <div className="metric-sub">
          <span>Weighted Multi-Factor</span>
        </div>
      </div>

      {/* CARD 3: Sea Ice */}
      <div className="metric-card">
        <div className="metric-header">
          <span>🌊</span> Sea Ice
        </div>
        <div className="metric-value-wrap">
          <div className="metric-value" style={{ color: '#38bdf8' }}>
            {seaIce}%
          </div>
        </div>
        <div className="metric-sub">
          <span>Condition: <strong>{getSeaIceCondition(seaIce)}</strong></span>
        </div>
      </div>

      {/* CARD 4: Nearest Iceberg */}
      <div className="metric-card">
        <div className="metric-header">
          <span>🧊</span> Nearest Iceberg
        </div>
        <div className="metric-value-wrap">
          <div className="metric-value" style={{ color: nearestIceberg < 25 ? '#ff7043' : '#e2f1ff' }}>
            {nearestIceberg} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>km</span>
          </div>
        </div>
        <div className="metric-sub">
          <span>Proximity Radar</span>
        </div>
      </div>

      {/* CARD 5: Iceberg Density */}
      <div className="metric-card">
        <div className="metric-header">
          <span>🧊</span> Iceberg Density
        </div>
        <div className="metric-value-wrap">
          <div className="metric-value" style={{ color: icebergDensity > 20 ? '#ffd600' : '#e2f1ff' }}>
            {icebergDensity}
          </div>
        </div>
        <div className="metric-sub">
          <span>Targets / Sector</span>
        </div>
      </div>

      {/* CARD 6: Navigation Status */}
      <div className="metric-card">
        <div className="metric-header">
          <span>⚠</span> Navigation Status
        </div>
        <div className="metric-value-wrap">
          <div className={`metric-value ${getStatusClass(navigationStatus)}`}>
            {navigationStatus}
          </div>
        </div>
        <div className="metric-sub">
          <span>Vessel Protocol</span>
        </div>
      </div>
    </section>
  );
}
