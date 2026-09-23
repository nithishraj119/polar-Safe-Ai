/**
 * POLAR-SAFE AI - Client-Side IMO Polar Code POLARIS Calculator
 * Mirror of backend polarisService for zero-latency client-side UI recalculations
 * Standard: IMO Resolution MSC.1/Circ.1519
 */

export const POLARIS_RIV_TABLE = {
  'PC1': {
    name: 'Polar Class 1 (Year-round all polar waters)',
    badge: 'Heavy Icebreaker',
    riv: { oldIce: 3, thickFirstYear: 3, mediumFirstYear: 3, thinFirstYear: 3, youngIce: 3, newIce: 3, openWater: 3 }
  },
  'PC2': {
    name: 'Polar Class 2 (Moderate multi-year ice)',
    badge: 'Heavy Icebreaker',
    riv: { oldIce: 2, thickFirstYear: 3, mediumFirstYear: 3, thinFirstYear: 3, youngIce: 3, newIce: 3, openWater: 3 }
  },
  'PC3': {
    name: 'Polar Class 3 (Second-year ice)',
    badge: 'Polar Research Flagship',
    riv: { oldIce: 1, thickFirstYear: 2, mediumFirstYear: 3, thinFirstYear: 3, youngIce: 3, newIce: 3, openWater: 3 }
  },
  'PC4': {
    name: 'Polar Class 4 (Thick first-year ice)',
    badge: 'Scientific Icebreaker',
    riv: { oldIce: -1, thickFirstYear: 1, mediumFirstYear: 2, thinFirstYear: 3, youngIce: 3, newIce: 3, openWater: 3 }
  },
  'PC5': {
    name: 'Polar Class 5 (Medium first-year ice)',
    badge: 'Polar Supply / Icebreaker',
    riv: { oldIce: -2, thickFirstYear: 0, mediumFirstYear: 1, thinFirstYear: 2, youngIce: 3, newIce: 3, openWater: 3 }
  },
  'PC6': {
    name: 'Polar Class 6 (Summer/autumn medium first-year)',
    badge: 'Light Icebreaker',
    riv: { oldIce: -3, thickFirstYear: -1, mediumFirstYear: 0, thinFirstYear: 1, youngIce: 2, newIce: 3, openWater: 3 }
  },
  'PC7': {
    name: 'Polar Class 7 (Summer/autumn thin first-year)',
    badge: 'Light Ice Strengthened',
    riv: { oldIce: -4, thickFirstYear: -2, mediumFirstYear: -1, thinFirstYear: 0, youngIce: 1, newIce: 2, openWater: 3 }
  },
  'NON_ICE': {
    name: 'Non-Ice Strengthened Vessel (Open water only)',
    badge: 'Unstrengthened Hull',
    riv: { oldIce: -10, thickFirstYear: -8, mediumFirstYear: -6, thinFirstYear: -4, youngIce: -2, newIce: 0, openWater: 3 }
  }
};

export function estimateIceRegimeClient(totalConcentration) {
  const concRatio = Math.max(0, Math.min(100, Number(totalConcentration))) / 100;
  
  if (concRatio <= 0.1) {
    return { openWater: 10, newIce: 0, youngIce: 0, thinFirstYear: 0, mediumFirstYear: 0, thickFirstYear: 0, oldIce: 0 };
  }

  const iceTenths = Math.round(concRatio * 10);
  const openWaterTenths = 10 - iceTenths;

  let oldIce = 0;
  let thickFirstYear = 0;
  let mediumFirstYear = 0;
  let thinFirstYear = 0;
  let youngIce = 0;
  let newIce = 0;

  if (iceTenths >= 8) {
    oldIce = Math.round(iceTenths * 0.35);
    thickFirstYear = Math.round(iceTenths * 0.35);
    mediumFirstYear = iceTenths - oldIce - thickFirstYear;
  } else if (iceTenths >= 6) {
    oldIce = Math.round(iceTenths * 0.25);
    thickFirstYear = Math.round(iceTenths * 0.30);
    mediumFirstYear = Math.round(iceTenths * 0.30);
    thinFirstYear = iceTenths - oldIce - thickFirstYear - mediumFirstYear;
  } else if (iceTenths >= 4) {
    thickFirstYear = Math.round(iceTenths * 0.25);
    mediumFirstYear = Math.round(iceTenths * 0.40);
    thinFirstYear = iceTenths - thickFirstYear - mediumFirstYear;
  } else {
    youngIce = Math.round(iceTenths * 0.5);
    newIce = iceTenths - youngIce;
  }

  return { openWater: openWaterTenths, newIce, youngIce, thinFirstYear, mediumFirstYear, thickFirstYear, oldIce };
}

export function evaluatePOLARISClient(vesselIceClass = 'PC3', seaIce = 63) {
  const iceClassKey = POLARIS_RIV_TABLE[vesselIceClass] ? vesselIceClass : 'PC3';
  const vesselSpec = POLARIS_RIV_TABLE[iceClassKey];
  const regime = estimateIceRegimeClient(seaIce);
  
  let rio = 0;
  const contributions = {};

  for (const [iceType, tenths] of Object.entries(regime)) {
    if (tenths > 0) {
      const riv = vesselSpec.riv[iceType] ?? 0;
      const val = (tenths / 10) * riv * 10;
      rio += val;
      contributions[iceType] = {
        concentrationTenths: tenths,
        riv,
        contribution: Math.round(val * 10) / 10
      };
    }
  }

  rio = Math.round(rio * 10) / 10;

  let operationalStatus = 'NORMAL_OPERATION';
  let statusLabel = 'Normal Operation';
  let operationalGuidance = 'Unrestricted navigation in current ice regime. Maintain standard polar watch.';
  let riskLevel = 'LOW';
  let color = '#00ff88';

  if (rio < -10) {
    operationalStatus = 'OPERATION_PROHIBITED';
    statusLabel = 'Operation Prohibited';
    operationalGuidance = 'Severe hull breach hazard. Current ice regime exceeds structural design limits under IMO MSC.1/Circ.1519. Course alteration mandatory.';
    riskLevel = 'CRITICAL';
    color = '#ff3d4f';
  } else if (rio < 0) {
    operationalStatus = 'ELEVATED_OPERATIONAL_RISK';
    statusLabel = 'Elevated Operational Risk';
    operationalGuidance = 'Operating under elevated risk. Reduce speed by at least 40%, double bridge lookout, and avoid acute ramming.';
    riskLevel = 'HIGH';
    color = '#ffd600';
  }

  return {
    standard: 'IMO MSC.1/Circ.1519 (POLARIS)',
    vesselIceClass: iceClassKey,
    vesselIceClassName: vesselSpec.name,
    vesselBadge: vesselSpec.badge,
    rio,
    operationalStatus,
    statusLabel,
    operationalGuidance,
    riskLevel,
    color,
    iceRegime: regime,
    contributions
  };
}
