import React from 'react';
import { POLARIS_RIV_TABLE } from '../services/polarisCalculator';

export default function PolarisPanel({
  polarisData,
  selectedIceClass,
  onSelectIceClass,
  seaIce
}) {
  if (!polarisData) return null;

  const {
    rio,
    operationalStatus,
    statusLabel,
    operationalGuidance,
    color,
    iceRegime,
    vesselIceClassName
  } = polarisData;

  const isProhibited = operationalStatus === 'OPERATION_PROHIBITED';
  const isElevated = operationalStatus === 'ELEVATED_OPERATIONAL_RISK';

  return (
    <section className="polar-card polaris-card" aria-label="IMO POLARIS Risk Index">
      <div className="card-header-row">
        <div className="card-title-group">
          <span className="card-title-icon">🧭</span>
          <h2 className="card-title">IMO Polar Code &amp; POLARIS Assessment</h2>
          <span className="badge-imo">IMO MSC.1/Circ.1519 &amp; MSC.385(94)</span>
        </div>

        {/* Polar Vessel Class Selector */}
        <div className="ice-class-picker">
          <label htmlFor="ice-class-select" className="picker-label">
            Vessel Ice Class:
          </label>
          <select
            id="ice-class-select"
            value={selectedIceClass}
            onChange={(e) => onSelectIceClass(e.target.value)}
            className="ice-class-dropdown"
          >
            {Object.entries(POLARIS_RIV_TABLE).map(([key, spec]) => (
              <option key={key} value={key}>
                [{key}] {spec.badge} - {key === 'NON_ICE' ? 'Unstrengthened' : `Polar Class ${key.replace('PC', '')}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="polaris-body-grid">
        {/* Metric 1: RIO Gauge Card */}
        <div className="polaris-metric-box">
          <div className="polaris-box-header">
            <span>📊</span> Risk Index Outcome (RIO)
          </div>
          <div className="rio-display-wrap">
            <div className="rio-number" style={{ color }}>
              {rio > 0 ? `+${rio}` : rio}
            </div>
            <div className="rio-formula">
              <code>RIO = &Sigma; (C<sub>i</sub> &times; RIV<sub>i</sub>)</code>
            </div>
          </div>
          <div className="rio-threshold-indicators">
            <span className={`thresh-tag ${rio >= 0 ? 'active-green' : ''}`}>RIO &ge; 0: Normal</span>
            <span className={`thresh-tag ${rio < 0 && rio >= -10 ? 'active-yellow' : ''}`}>-10 to 0: Elevated</span>
            <span className={`thresh-tag ${rio < -10 ? 'active-red' : ''}`}>&lt; -10: Prohibited</span>
          </div>
        </div>

        {/* Metric 2: Operational Status Banner */}
        <div
          className={`polaris-status-box ${
            isProhibited ? 'status-prohibited' : isElevated ? 'status-elevated' : 'status-normal'
          }`}
        >
          <div className="status-box-title">
            <span>{isProhibited ? '⛔' : isElevated ? '⚠️' : '✅'}</span>
            <strong>{statusLabel}</strong>
          </div>
          <p className="status-box-guidance">{operationalGuidance}</p>
          <div className="status-vessel-meta">
            <span>Class: <strong>{vesselIceClassName}</strong></span>
            <span>Sea Ice: <strong>{seaIce}%</strong></span>
          </div>
        </div>

        {/* Metric 3: Ice Regime Composition Tenths */}
        <div className="polaris-regime-box">
          <div className="regime-header">
            <span>🧊</span> Evaluated Ice Regime (Tenths / 10)
          </div>
          <div className="regime-bars-grid">
            {iceRegime && (
              <>
                <div className="regime-item">
                  <span className="regime-name">Open Water</span>
                  <span className="regime-val">{iceRegime.openWater}/10</span>
                </div>
                <div className="regime-item">
                  <span className="regime-name">New / Young Ice</span>
                  <span className="regime-val">{(iceRegime.newIce || 0) + (iceRegime.youngIce || 0)}/10</span>
                </div>
                <div className="regime-item">
                  <span className="regime-name">Thin/Med First-Year</span>
                  <span className="regime-val">{(iceRegime.thinFirstYear || 0) + (iceRegime.mediumFirstYear || 0)}/10</span>
                </div>
                <div className="regime-item">
                  <span className="regime-name">Thick / Old Ice</span>
                  <span className="regime-val">{(iceRegime.thickFirstYear || 0) + (iceRegime.oldIce || 0)}/10</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
