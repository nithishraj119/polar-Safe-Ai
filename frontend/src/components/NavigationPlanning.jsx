import React from 'react';

export default function NavigationPlanning({
  startPoint,
  destPoint,
  onAnalyze,
  onReset,
  isLoading
}) {
  const formatCoord = (point) => {
    if (!point) return 'Not selected (Click map)';
    return `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`;
  };

  const isReadyToAnalyze = startPoint && destPoint;

  return (
    <section className="polar-card" aria-labelledby="nav-planning-title">
      <div className="section-header">
        <h2 id="nav-planning-title" className="section-title">
          <span>🧭</span> Navigation Planning
        </h2>
        <span className="card-subtitle" style={{ margin: 0 }}>
          Interactive Antarctic Trajectory Engine
        </span>
      </div>

      <p className="card-subtitle">
        Click the map to select <strong>Start Location</strong> (first click) and click again to select <strong>Destination</strong> (second click).
      </p>

      <div className="nav-planning-grid">
        {/* Start Location Field */}
        <div className="input-field-group">
          <label className="input-label" htmlFor="start-location-input">
            <span>📍</span> Start Location
          </label>
          <div className="input-wrapper" id="start-location-input">
            <span className="input-text">
              {startPoint?.name || (startPoint ? 'Selected Waypoint Alpha' : 'Research Station Alpha')}
            </span>
            <span className="input-coords mono-text">
              Start: {formatCoord(startPoint)}
            </span>
          </div>
        </div>

        {/* Destination Field */}
        <div className="input-field-group">
          <label className="input-label" htmlFor="dest-location-input">
            <span>🎯</span> Destination
          </label>
          <div className="input-wrapper" id="dest-location-input">
            <span className="input-text">
              {destPoint?.name || (destPoint ? 'Selected Waypoint Bravo' : 'Target Observation Point')}
            </span>
            <span className="input-coords mono-text">
              Destination: {formatCoord(destPoint)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="nav-buttons-group">
          <button
            id="btn-analyze-route"
            className="btn-polar btn-primary"
            onClick={onAnalyze}
            disabled={!isReadyToAnalyze || isLoading}
            aria-label="Analyze Route Risk"
          >
            <span>{isLoading ? '⏳' : '⚡'}</span>
            <span>{isLoading ? 'Analyzing Route...' : 'Analyze Route'}</span>
          </button>

          <button
            id="btn-reset-route"
            className="btn-polar btn-secondary"
            onClick={onReset}
            disabled={isLoading}
            aria-label="Reset Route and Points"
          >
            <span>🔄</span>
            <span>Reset Route</span>
          </button>
        </div>
      </div>
    </section>
  );
}
