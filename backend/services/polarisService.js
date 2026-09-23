/**
 * POLAR-SAFE AI - IMO Polar Code & POLARIS Engine
 * Standard: IMO Resolution MSC.1/Circ.1519 (POLARIS - Polar Operational Limit Assessment Risk Indexing System)
 * Polar Code: IMO Resolution MSC.385(94)
 */

// Risk Index Values (RIV) for each Polar Vessel Ice Class according to IMO POLARIS Table 1
// Ice Classes: PC1 (Heavy Icebreaker) down to PC7 (Light Icebreaker), Category A/B/C, and Non-Ice Strengthened
const POLARIS_RIV_TABLE = {
  'PC1': {
    name: 'Polar Class 1 (Year-round operation in all polar waters)',
    riv: {
      oldIce: 3,
      thickFirstYear: 3,
      mediumFirstYear: 3,
      thinFirstYear: 3,
      youngIce: 3,
      newIce: 3,
      openWater: 3
    }
  },
  'PC2': {
    name: 'Polar Class 2 (Year-round operation in moderate multi-year ice)',
    riv: {
      oldIce: 2,
      thickFirstYear: 3,
      mediumFirstYear: 3,
      thinFirstYear: 3,
      youngIce: 3,
      newIce: 3,
      openWater: 3
    }
  },
  'PC3': {
    name: 'Polar Class 3 (Year-round operation in second-year ice)',
    riv: {
      oldIce: 1,
      thickFirstYear: 2,
      mediumFirstYear: 3,
      thinFirstYear: 3,
      youngIce: 3,
      newIce: 3,
      openWater: 3
    }
  },
  'PC4': {
    name: 'Polar Class 4 (Year-round operation in thick first-year ice)',
    riv: {
      oldIce: -1,
      thickFirstYear: 1,
      mediumFirstYear: 2,
      thinFirstYear: 3,
      youngIce: 3,
      newIce: 3,
      openWater: 3
    }
  },
  'PC5': {
    name: 'Polar Class 5 (Year-round operation in medium first-year ice)',
    riv: {
      oldIce: -2,
      thickFirstYear: 0,
      mediumFirstYear: 1,
      thinFirstYear: 2,
      youngIce: 3,
      newIce: 3,
      openWater: 3
    }
  },
  'PC6': {
    name: 'Polar Class 6 (Summer/autumn operation in medium first-year ice)',
    riv: {
      oldIce: -3,
      thickFirstYear: -1,
      mediumFirstYear: 0,
      thinFirstYear: 1,
      youngIce: 2,
      newIce: 3,
      openWater: 3
    }
  },
  'PC7': {
    name: 'Polar Class 7 (Summer/autumn operation in thin first-year ice)',
    riv: {
      oldIce: -4,
      thickFirstYear: -2,
      mediumFirstYear: -1,
      thinFirstYear: 0,
      youngIce: 1,
      newIce: 2,
      openWater: 3
    }
  },
  'NON_ICE': {
    name: 'Non-Ice Strengthened Vessel (Open water / light young ice only)',
    riv: {
      oldIce: -10,
      thickFirstYear: -8,
      mediumFirstYear: -6,
      thinFirstYear: -4,
      youngIce: -2,
      newIce: 0,
      openWater: 3
    }
  }
};

/**
 * Estimate Ice Regime composition based on general Sea Ice Concentration (0-100%)
 * In Antarctic waters, higher concentration correlates with thicker multi-year floes
 * @param {number} totalConcentration - 0 to 100%
 * @returns {Object} Tenths of ice concentration (summing to 10 tenths = 1.0)
 */
function estimateIceRegime(totalConcentration) {
  const concRatio = Math.max(0, Math.min(100, Number(totalConcentration))) / 100;
  
  if (concRatio <= 0.1) {
    return {
      openWater: 10,
      newIce: 0,
      youngIce: 0,
      thinFirstYear: 0,
      mediumFirstYear: 0,
      thickFirstYear: 0,
      oldIce: 0
    };
  }

  // Fraction of total ice tenths (out of 10)
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

  return {
    openWater: openWaterTenths,
    newIce,
    youngIce,
    thinFirstYear,
    mediumFirstYear,
    thickFirstYear,
    oldIce
  };
}

/**
 * Calculate Risk Index Outcome (RIO) per IMO POLARIS standard
 * RIO = sum( C_i * RIV_i )
 * 
 * Operational criteria:
 * - RIO >= 0 : Normal Operation
 * - -10 <= RIO < 0 : Elevated Operational Risk (Subject to operational restrictions / reduced speed)
 * - RIO < -10 : Operation Prohibited (Special consideration / structural risk)
 * 
 * @param {string} vesselIceClass - 'PC1' through 'PC7', or 'NON_ICE'
 * @param {number} totalConcentration - 0 to 100%
 * @param {Object} [customRegime] - Optional manual override of ice regime
 */
function calculatePOLARIS(vesselIceClass = 'PC3', totalConcentration = 63, customRegime = null) {
  const iceClassKey = POLARIS_RIV_TABLE[vesselIceClass] ? vesselIceClass : 'PC3';
  const vesselSpec = POLARIS_RIV_TABLE[iceClassKey];
  const regime = customRegime || estimateIceRegime(totalConcentration);
  
  let rio = 0;
  const contributions = {};

  for (const [iceType, tenths] of Object.entries(regime)) {
    if (tenths > 0) {
      const riv = vesselSpec.riv[iceType] ?? 0;
      const val = (tenths / 10) * riv * 10; // RIO contribution
      rio += val;
      contributions[iceType] = {
        concentrationTenths: tenths,
        concentrationPercent: tenths * 10,
        riv,
        contribution: Math.round(val * 10) / 10
      };
    }
  }

  rio = Math.round(rio * 10) / 10;

  let operationalStatus = 'NORMAL_OPERATION';
  let statusLabel = 'Normal Operation (IMO Polar Code Compliant)';
  let operationalGuidance = 'Vessel is capable of unrestricted navigation in the current ice regime. Maintain standard polar lookout and watchkeeping.';
  let riskLevel = 'LOW';
  let color = '#00ff88';

  if (rio < -10) {
    operationalStatus = 'OPERATION_PROHIBITED';
    statusLabel = 'Operation Prohibited (Severe Structural Risk)';
    operationalGuidance = 'CRITICAL HAZARD: The ice regime exceeds vessel structural design limits under IMO Polar Code MSC.1/Circ.1519. Immediate course diversion to lower concentration waters or icebreaker escort is mandatory.';
    riskLevel = 'CRITICAL';
    color = '#ff3d4f';
  } else if (rio < 0) {
    operationalStatus = 'ELEVATED_OPERATIONAL_RISK';
    statusLabel = 'Elevated Risk (Operational Restrictions Apply)';
    operationalGuidance = 'CAUTION: Operating under elevated risk. Speed must be reduced by at least 40%. Bridge watch must be doubled. Avoid ramming or turning sharply against floe edges.';
    riskLevel = 'HIGH';
    color = '#ffd600';
  }

  return {
    standard: 'IMO MSC.1/Circ.1519 (POLARIS)',
    vesselIceClass: iceClassKey,
    vesselIceClassName: vesselSpec.name,
    rio,
    operationalStatus,
    statusLabel,
    operationalGuidance,
    riskLevel,
    color,
    iceRegime: regime,
    contributions,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  POLARIS_RIV_TABLE,
  estimateIceRegime,
  calculatePOLARIS
};
