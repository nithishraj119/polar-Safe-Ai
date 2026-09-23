import React from 'react';

export default function DisclaimerBanner() {
  return (
    <div className="disclaimer-banner" role="alert">
      <div className="disclaimer-content">
        <span className="disclaimer-badge">Decision Support</span>
        <span>
          <strong>Operational Notice:</strong> This system is a <strong>decision-support and visualization dashboard</strong>, NOT an autonomous navigation system. It does not guarantee safe vessel transit. Environmental data is simulated for research and demonstration purposes.
        </span>
      </div>
    </div>
  );
}
