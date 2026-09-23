import React from 'react';
import { evaluateConfidence } from '../services/confidenceCalculator';

export default function AiConfidencePanel({
  seaIce,
  nearestIceberg,
  icebergDensity,
  riskScore
}) {
  // Compute all confidence scores dynamically based on the current environmental and risk inputs
  const {
    overall,
    level,
    color,
    satellite,
    environmental,
    icebergDetection,
    freshness,
    routeAnalysis
  } = evaluateConfidence(seaIce, nearestIceberg, icebergDensity, riskScore);

  // SVG Ring coordinates helper
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  return (
    <section className="polar-card" aria-labelledby="confidence-title" style={{ marginTop: '1.6rem' }}>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 id="confidence-title" className="section-title">
            <span>🛡</span> AI ANALYSIS CONFIDENCE
          </h2>
          <span className="card-subtitle" style={{ margin: 0 }}>
            Confidence level of satellite and environmental data analysis
          </span>
        </div>
      </div>

      {/* Grid Layout containing Main Ring & Sub-metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '1.25rem' }}>
        
        {/* Left Column: Overall Confidence Ring */}
        <div style={{
          background: 'var(--bg-card-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '1rem',
          position: 'relative'
        }}>
          <span className="status-mini-header" style={{ position: 'absolute', top: '1rem', left: '1.25rem' }}>
            OVERALL CONFIDENCE
          </span>

          {/* SVG Circular Ring Indicator */}
          <div style={{ position: 'relative', width: '110px', height: '110px', marginTop: '1rem' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth={strokeWidth}
              />
              {/* Active Ring with Dynamic Color */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                {overall}%
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: color,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              {level}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Status: CALIBRATED
            </span>
          </div>
        </div>

        {/* Right Column: Sub-metrics Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {/* Metric 1: Satellite Image Confidence */}
            <div className="status-mini-card">
              <div className="status-mini-header">📸 Satellite Image</div>
              <div className="status-mini-main" style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem' }}>{satellite}%</div>
              <div className="status-mini-detail">Quality and reliability of satellite imagery</div>
            </div>

            {/* Metric 2: Environmental Data Confidence */}
            <div className="status-mini-card">
              <div className="status-mini-header">🌡 Environmental Data</div>
              <div className="status-mini-main" style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem' }}>{environmental}%</div>
              <div className="status-mini-detail">Reliability of environmental observations</div>
            </div>

            {/* Metric 3: Iceberg Detection Confidence */}
            <div className="status-mini-card">
              <div className="status-mini-header">🧊 Iceberg Detection</div>
              <div className="status-mini-main" style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem' }}>{icebergDetection}%</div>
              <div className="status-mini-detail">AI confidence in detected iceberg information</div>
            </div>

            {/* Metric 4: Data Freshness */}
            <div className="status-mini-card">
              <div className="status-mini-header">⏳ Data Freshness</div>
              <div className="status-mini-main" style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem' }}>{freshness}%</div>
              <div className="status-mini-detail">How recent the available data is</div>
            </div>

            {/* Metric 5: Route Analysis Confidence */}
            <div className="status-mini-card" style={{ gridColumn: 'span 2' }}>
              <div className="status-mini-header">🧭 Route Analysis</div>
              <div className="status-mini-main" style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem' }}>{routeAnalysis}%</div>
              <div className="status-mini-detail">Confidence in the calculated navigation risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Factors Section */}
      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <h4 style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          marginBottom: '0.75rem'
        }}>
          CONFIDENCE FACTORS
        </h4>
        <ul style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.75rem',
          listStyleType: 'none',
          padding: 0,
          margin: 0
        }}>
          {[
            'Satellite image quality',
            'Environmental data availability',
            'Iceberg detection reliability',
            'Data freshness',
            'Route analysis consistency'
          ].map((factor, index) => (
            <li key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span> {factor}
            </li>
          ))}
        </ul>
      </div>

      {/* Responsive Inline CSS for Grid Adaptation on smaller screen sizes */}
      <style>{`
        @media (max-width: 900px) {
          section[aria-labelledby="confidence-title"] > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
