import React from 'react';

export default function RouteComparison({
  selectedRisk = 88,
  recommendedRisk = 62,
  delta = 26,
  isAnalyzed = true
}) {
  const getRiskColor = (val) => {
    if (val >= 81) return '#ff3d4f';
    if (val >= 61) return '#ff7043';
    if (val >= 31) return '#ffd600';
    return '#00e676';
  };

  return (
    <section className="polar-card" aria-labelledby="route-comp-title" style={{ marginTop: '1.5rem' }}>
      <div className="section-header">
        <h2 id="route-comp-title" className="section-title">
          <span>🧭</span> Route Comparison
        </h2>
        <span className="card-subtitle" style={{ margin: 0 }}>
          Direct vs. AI Safe Waypoint Optimization
        </span>
      </div>

      <div className="route-comparison-grid">
        {/* CARD 1: Selected Route */}
        <div className="comparison-card comparison-card-selected">
          <div className="comparison-header">
            <span>🔵</span> Selected Route (Direct)
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Calculated Risk:</span>
            <div className="comparison-risk-display" style={{ color: getRiskColor(selectedRisk) }}>
              {selectedRisk} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>
          <div
            className="comparison-status-tag"
            style={{
              background: selectedRisk > 60 ? 'rgba(255, 61, 79, 0.2)' : 'rgba(255, 214, 0, 0.2)',
              color: selectedRisk > 60 ? '#ff3d4f' : '#ffd600'
            }}
          >
            Status: {selectedRisk > 60 ? 'Higher Risk' : 'Moderate Direct Risk'}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
            Linear rhumb-line vector traversing standard drift corridors.
          </p>
        </div>

        {/* CARD 2: AI Recommended Route */}
        <div className="comparison-card comparison-card-recommended">
          <div className="comparison-header">
            <span>🟢</span> AI Recommended Route (Route B)
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Calculated Risk:</span>
            <div className="comparison-risk-display" style={{ color: '#00e676' }}>
              {recommendedRisk} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>
          <div
            className="comparison-status-tag"
            style={{
              background: 'rgba(0, 230, 118, 0.2)',
              color: '#00e676'
            }}
          >
            Status: Lower Risk
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
            Optimized bypass heading clearing dense pack ice fields and tabular iceberg swarms.
          </p>
        </div>

        {/* CARD 3: AI Comparison */}
        <div className="comparison-card comparison-card-delta">
          <div className="comparison-header">
            <span>🤖</span> AI Comparison
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Safety Differential:</span>
            <div className="comparison-risk-display" style={{ color: '#ffd600' }}>
              {delta > 0 ? `${delta} points safer` : 'Equal calculated risk'}
            </div>
          </div>
          <div
            className="comparison-status-tag"
            style={{
              background: 'rgba(255, 214, 0, 0.2)',
              color: '#ffd600'
            }}
          >
            Recommended Route
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontWeight: 600 }}>
            Recommended route has lower calculated risk.
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 'auto' }}>
            *Disclaimer: Decision-support calculation only. Does not guarantee safe navigation.
          </p>
        </div>
      </div>
    </section>
  );
}
