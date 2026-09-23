import React from 'react';

export default function NavigationStatus({
  riskScore = 80,
  riskLevel = 'HIGH',
  seaIce = 63,
  nearestIceberg = 24,
  icebergDensity = 17,
  decision = 'AVOID HIGH-RISK AREA',
  recommendation = 'Review AI recommended route and avoid high-density iceberg regions.',
  navigationStatus = 'CAUTION'
}) {
  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'var(--color-red)';
      case 'HIGH': return '#ff7043';
      case 'MODERATE': return 'var(--color-yellow)';
      case 'LOW': default: return 'var(--color-green)';
    }
  };

  const getSeaIceCondition = (val) => {
    if (val >= 85) return 'Severe Pack Ice';
    if (val >= 70) return 'Heavy Ice';
    if (val >= 50) return 'Moderate';
    if (val >= 30) return 'Open Drift';
    return 'Very Open Water';
  };

  return (
    <aside className="polar-card nav-status-panel" aria-label="Navigation Status Summary">
      <div className="card-title-group" style={{ margin: 0, paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="card-title-icon">🧭</span>
        <span className="card-title">Navigation Status</span>
      </div>

      {/* Mini Card 1: Overall Risk */}
      <div className="status-mini-card" style={{ borderLeft: `4px solid ${getRiskColor(riskLevel)}` }}>
        <div className="status-mini-header">Overall Risk</div>
        <div className="status-mini-main" style={{ color: getRiskColor(riskLevel) }}>
          {riskLevel}
        </div>
        <div className="status-mini-detail mono-text">
          Risk Score: <strong>{riskScore}/100</strong>
        </div>
      </div>

      {/* Mini Card 2: Sea Ice */}
      <div className="status-mini-card">
        <div className="status-mini-header">Sea Ice</div>
        <div className="status-mini-main" style={{ color: '#38bdf8' }}>
          Concentration: {seaIce}%
        </div>
        <div className="status-mini-detail">
          Condition: <strong>{getSeaIceCondition(seaIce)}</strong>
        </div>
      </div>

      {/* Mini Card 3: Icebergs */}
      <div className="status-mini-card">
        <div className="status-mini-header">Icebergs</div>
        <div className="status-mini-main" style={{ color: '#e2f1ff' }}>
          Detected: {icebergDensity}
        </div>
        <div className="status-mini-detail mono-text">
          Nearest: <strong style={{ color: nearestIceberg < 25 ? '#ff7043' : '#38bdf8' }}>{nearestIceberg} km</strong>
        </div>
      </div>

      {/* Mini Card 4: Recommended Route & Decision */}
      <div className="status-mini-card" style={{ borderLeft: '4px solid var(--color-green)' }}>
        <div className="status-mini-header">Recommended Route</div>
        <div className="status-mini-detail" style={{ fontWeight: 600, color: '#e2f1ff' }}>
          Route B recommended. Avoid high-risk iceberg zones.
        </div>
        <div style={{ marginTop: '0.35rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Decision: </span>
          <span
            className="mono-text"
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: getRiskColor(riskLevel)
            }}
          >
            {decision}
          </span>
        </div>
      </div>

      {/* AI Decision Box */}
      <div className="ai-recommendation-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
          <span>🤖</span> AI Decision &amp; Advisory
        </div>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {recommendation || 'Avoid high-density iceberg regions and areas with elevated sea-ice concentration.'}
        </p>
      </div>
    </aside>
  );
}
