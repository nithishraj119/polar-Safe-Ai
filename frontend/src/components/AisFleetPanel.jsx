import React from 'react';

export default function AisFleetPanel({ fleet = [], activeVesselId, onSelectVessel }) {
  if (!fleet || fleet.length === 0) return null;

  return (
    <section className="polar-card ais-fleet-card" aria-label="AIS Polar Research Fleet">
      <div className="card-header-row">
        <div className="card-title-group">
          <span className="card-title-icon">🚢</span>
          <h2 className="card-title">AIS Polar Fleet Tracking &amp; Telemetry</h2>
          <span className="badge-ais-live">LIVE AIS TRANSCEIVER (5 VESSELS)</span>
        </div>
      </div>

      <div className="fleet-cards-grid">
        {fleet.map((vessel) => {
          const isSelected = vessel.id === activeVesselId;

          return (
            <div
              key={vessel.id}
              onClick={() => onSelectVessel(vessel)}
              className={`fleet-vessel-card ${isSelected ? 'fleet-vessel-active' : ''}`}
            >
              <div className="vessel-top-line">
                <span className="vessel-flag-name">
                  <span className="vessel-icon">🚢</span>
                  <strong>{vessel.name}</strong>
                </span>
                <span className={`vessel-class-tag ${vessel.isFlagship ? 'flagship-tag' : ''}`}>
                  {vessel.iceClass}
                </span>
              </div>

              <div className="vessel-telemetry-row">
                <span>MMSI: <code>{vessel.mmsi}</code></span>
                <span>Call: <code>{vessel.callSign}</code></span>
              </div>

              <div className="vessel-nav-status">
                <div>Pos: <strong>{vessel.position[0].toFixed(2)}&deg;, {vessel.position[1].toFixed(2)}&deg;</strong></div>
                <div>SOG: <strong>{vessel.sogKnots} kts</strong> | HDG: <strong>{vessel.headingDeg}&deg;</strong></div>
                <div className="vessel-dest-line">
                  Dest: <strong>{vessel.destination}</strong>
                </div>
              </div>

              <div className="vessel-action-footer">
                <button className={`btn-select-vessel ${isSelected ? 'btn-active' : ''}`}>
                  {isSelected ? '★ ACTIVE VESSEL' : 'Select Ship'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
