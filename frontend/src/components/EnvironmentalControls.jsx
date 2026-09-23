import React, { useState } from 'react';

export default function EnvironmentalControls({
  seaIce,
  setSeaIce,
  nearestIceberg,
  setNearestIceberg,
  icebergDensity,
  setIcebergDensity
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleUnlockClick = () => {
    if (isUnlocked) {
      setIsUnlocked(false);
    } else {
      setShowModal(true);
    }
  };

  const handleConfirmUnlock = () => {
    setIsUnlocked(true);
    setShowModal(false);
  };

  const handleCancelModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <section className="polar-card" aria-labelledby="controls-title" style={{ position: 'relative' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 id="controls-title" className="section-title">
              <span>🎛</span> Environmental Data Controls
            </h2>
            <span className="card-subtitle" style={{ margin: 0 }}>
              Interactive Hazard Simulator
            </span>
          </div>

          {/* Simulation Mode Toggle Button — Top Right */}
          <button
            id="sim-mode-toggle"
            onClick={handleUnlockClick}
            className="sim-toggle-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${isUnlocked ? 'var(--status-caution)' : 'var(--border-color)'}`,
              background: isUnlocked
                ? 'rgba(234, 179, 8, 0.12)'
                : 'var(--bg-card-secondary)',
              color: isUnlocked ? 'var(--status-caution)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = isUnlocked ? 'var(--status-caution)' : 'var(--border-highlight)';
              e.currentTarget.style.background = isUnlocked
                ? 'rgba(234, 179, 8, 0.2)'
                : 'var(--bg-card-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = isUnlocked
                ? '0 0 16px rgba(234, 179, 8, 0.25)'
                : 'var(--shadow-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isUnlocked ? 'var(--status-caution)' : 'var(--border-color)';
              e.currentTarget.style.background = isUnlocked
                ? 'rgba(234, 179, 8, 0.12)'
                : 'var(--bg-card-secondary)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            aria-label={isUnlocked ? 'Lock simulation controls' : 'Unlock simulation controls'}
          >
            <span style={{ fontSize: '1rem' }}>{isUnlocked ? '🔓' : '🔒'}</span>
            {isUnlocked ? 'SIMULATION ACTIVE' : 'UNLOCK CONTROLS'}
          </button>
        </div>

        <p className="card-subtitle">
          Adjust environmental conditions to simulate real-time route-risk changes and observe AI decision shifts.
        </p>

        {/* Locked Overlay */}
        {!isUnlocked && (
          <div
            className="sim-locked-overlay"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: '120px',
              background: 'rgba(6, 6, 8, 0.7)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              zIndex: 5,
            }}
          >
            <span style={{ fontSize: '2rem', opacity: 0.6 }}>🔒</span>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Controls Locked — Click "Unlock Controls" to enable
            </p>
          </div>
        )}

        <div className="controls-grid" style={{ opacity: isUnlocked ? 1 : 0.35, pointerEvents: isUnlocked ? 'auto' : 'none', transition: 'opacity 0.3s ease' }}>
          {/* Slider 1: Sea-Ice Concentration */}
          <div className="slider-group">
            <div className="slider-header">
              <label className="slider-label" htmlFor="slider-sea-ice">
                1. Sea-Ice Concentration
              </label>
              <span className="slider-readout" id="sea-ice-value-readout">
                {seaIce}%
              </span>
            </div>
            <input
              id="slider-sea-ice"
              type="range"
              min="0"
              max="100"
              value={seaIce}
              onChange={(e) => setSeaIce(Number(e.target.value))}
              className="range-slider"
              aria-label="Sea Ice Concentration Percentage"
              disabled={!isUnlocked}
            />
            <div className="slider-scale">
              <span>0% (Open Sea)</span>
              <span>50%</span>
              <span>100% (Dense Pack)</span>
            </div>
          </div>

          {/* Slider 2: Nearest Iceberg Distance */}
          <div className="slider-group">
            <div className="slider-header">
              <label className="slider-label" htmlFor="slider-iceberg-dist">
                2. Nearest Iceberg Distance
              </label>
              <span className="slider-readout" id="iceberg-dist-value-readout">
                {nearestIceberg} km
              </span>
            </div>
            <input
              id="slider-iceberg-dist"
              type="range"
              min="1"
              max="100"
              value={nearestIceberg}
              onChange={(e) => setNearestIceberg(Number(e.target.value))}
              className="range-slider"
              aria-label="Nearest Iceberg Distance in Kilometers"
              disabled={!isUnlocked}
            />
            <div className="slider-scale">
              <span>1 km (Critical Proximity)</span>
              <span>50 km</span>
              <span>100 km (Safe Clearance)</span>
            </div>
          </div>

          {/* Slider 3: Iceberg Density */}
          <div className="slider-group">
            <div className="slider-header">
              <label className="slider-label" htmlFor="slider-iceberg-density">
                3. Iceberg Density
              </label>
              <span className="slider-readout" id="iceberg-density-value-readout">
                {icebergDensity}
              </span>
            </div>
            <input
              id="slider-iceberg-density"
              type="range"
              min="0"
              max="50"
              value={icebergDensity}
              onChange={(e) => setIcebergDensity(Number(e.target.value))}
              className="range-slider"
              aria-label="Iceberg Density Count"
              disabled={!isUnlocked}
            />
            <div className="slider-scale">
              <span>0 (Sparse)</span>
              <span>25</span>
              <span>50 (Heavy Swarm)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Simulation Mode Warning Modal */}
      {showModal && (
        <div
          className="sim-modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={handleCancelModal}
        >
          <div
            className="sim-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--status-caution)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              maxWidth: '520px',
              width: '90%',
              boxShadow: '0 0 60px rgba(234, 179, 8, 0.15), var(--shadow-card)',
              animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Warning Icon */}
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(234, 179, 8, 0.12)',
                border: '2px solid var(--status-caution)',
                fontSize: '1.6rem',
              }}>
                ⚠️
              </span>
            </div>

            {/* Title */}
            <h3 style={{
              color: 'var(--status-caution)',
              fontFamily: 'var(--font-main)',
              fontSize: '1.2rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '8px',
              letterSpacing: '0.02em',
            }}>
              Entering Simulation Mode
            </h3>

            {/* Subtitle */}
            <p style={{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '20px',
            }}>
              Environmental Data Override Warning
            </p>

            {/* Warning Message */}
            <div style={{
              background: 'rgba(234, 179, 8, 0.06)',
              border: '1px solid rgba(234, 179, 8, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              marginBottom: '24px',
            }}>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                marginBottom: '12px',
              }}>
                You are about to enable <strong style={{ color: 'var(--status-caution)' }}>Simulation Mode</strong>. This allows manual override of environmental telemetry data including:
              </p>
              <ul style={{
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                lineHeight: 1.8,
                paddingLeft: '20px',
              }}>
                <li>Sea-Ice Concentration values</li>
                <li>Nearest Iceberg Distance readings</li>
                <li>Iceberg Density parameters</li>
              </ul>
            </div>

            {/* Caution Note */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '24px',
            }}>
              <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: '1px' }}>🚨</span>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                lineHeight: 1.5,
              }}>
                <strong style={{ color: 'var(--status-danger)' }}>Caution:</strong> Simulated values will affect risk calculations, route assessments, and navigation recommendations. These do <em>not</em> reflect real-time sensor data.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
            }}>
              <button
                id="sim-modal-cancel"
                onClick={handleCancelModal}
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card-secondary)',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.borderColor = 'var(--border-highlight)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                CANCEL
              </button>

              <button
                id="sim-modal-confirm"
                onClick={handleConfirmUnlock}
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--status-caution)',
                  background: 'rgba(234, 179, 8, 0.15)',
                  color: 'var(--status-caution)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(234, 179, 8, 0.3)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(234, 179, 8, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(234, 179, 8, 0.15)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ⚠️ ENABLE SIMULATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe styles for modal animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
