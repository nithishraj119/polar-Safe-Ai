import React from 'react';

export default function SystemStatus({
  isBackendOnline = true,
  isDbConnected = false,
  lastAnalysisTime = null
}) {
  const subsystems = [
    {
      name: 'System Status',
      status: 'ONLINE',
      color: 'dot-green',
      text: 'ONLINE'
    },
    {
      name: 'Environmental Data',
      status: 'LIVE',
      color: 'dot-green',
      text: 'LIVE'
    },
    {
      name: 'Iceberg Tracking',
      status: 'ACTIVE',
      color: 'dot-green',
      text: 'ACTIVE'
    },
    {
      name: 'AI Route Analysis',
      status: 'ACTIVE',
      color: 'dot-green',
      text: 'ACTIVE'
    },
    {
      name: 'Database',
      status: isDbConnected ? 'CONNECTED' : 'OFFLINE',
      color: isDbConnected ? 'dot-green' : 'dot-red',
      text: isDbConnected ? 'CONNECTED' : 'OFFLINE'
    },
    {
      name: 'Backend API',
      status: isBackendOnline ? 'ONLINE' : 'OFFLINE',
      color: isBackendOnline ? 'dot-green' : 'dot-red',
      text: isBackendOnline ? 'ONLINE' : 'OFFLINE'
    },
    {
      name: 'Last Analysis',
      status: lastAnalysisTime ? 'COMPLETED' : 'WAITING',
      color: lastAnalysisTime ? 'dot-blue' : 'dot-yellow',
      text: lastAnalysisTime || 'Waiting...'
    }
  ];

  return (
    <section className="polar-card system-status-table-card" aria-labelledby="sys-status-title" style={{ marginTop: '1.5rem' }}>
      <div className="section-header">
        <h2 id="sys-status-title" className="section-title">
          <span>⚙</span> System Status
        </h2>
        <span className="card-subtitle" style={{ margin: 0 }}>
          Subsystem Diagnostics &amp; Health
        </span>
      </div>

      <div className="system-status-grid">
        {subsystems.map((sub, idx) => (
          <div key={`subsys-${idx}`} className="system-status-row">
            <span className="system-status-name">{sub.name}</span>
            <div className="system-status-indicator">
              <span className={`system-indicator-dot ${sub.color}`} />
              <span
                style={{
                  color: sub.color === 'dot-green'
                    ? 'var(--color-green)'
                    : sub.color === 'dot-red'
                    ? 'var(--color-red)'
                    : sub.color === 'dot-blue'
                    ? 'var(--accent-cyan)'
                    : 'var(--color-yellow)'
                }}
              >
                ● {sub.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
