/**
 * POLAR-SAFE AI - AIS Polar Fleet Tracking & Simulation Service
 * 
 * Provides realistic Automatic Identification System (AIS) Class A
 * telemetry for active Antarctic research vessels and polar science fleets.
 */

const POLAR_FLEET = [
  {
    id: 'rv-polaris',
    mmsi: 235102940,
    callSign: 'MQLX7',
    name: 'R/V POLARIS',
    flag: '🇬🇧 UK / BAS',
    iceClass: 'PC3',
    iceClassName: 'Polar Class 3 (Year-Round Second-Year Ice)',
    type: 'Polar Research & Supply Vessel',
    lengthMeters: 128.5,
    beamMeters: 24.0,
    draftMeters: 8.2,
    position: [-65.0000, -30.0000],
    sogKnots: 13.8, // Speed Over Ground
    cogDeg: 84.0,   // Course Over Ground
    headingDeg: 85,
    navStatus: 'Underway using Engine',
    destination: 'Halley VI Research Station',
    eta: '2026-03-04 18:00 UTC',
    fuelType: 'Low-Sulfur Marine Gas Oil (MGO)',
    isFlagship: true
  },
  {
    id: 'rv-attenborough',
    mmsi: 232025793,
    callSign: 'ZDLS7',
    name: 'R/V SIR DAVID ATTENBOROUGH',
    flag: '🇬🇧 UK / BAS',
    iceClass: 'PC4',
    iceClassName: 'Polar Class 4 (Year-Round Thick First-Year Ice)',
    type: 'Scientific Icebreaker',
    lengthMeters: 129.0,
    beamMeters: 24.0,
    draftMeters: 8.7,
    position: [-62.2000, -58.9000],
    sogKnots: 11.4,
    cogDeg: 142.0,
    headingDeg: 140,
    navStatus: 'Conducting Oceanographic Survey',
    destination: 'Rothera Research Station',
    eta: '2026-03-02 06:30 UTC',
    fuelType: 'Hybrid Diesel-Electric / MGO',
    isFlagship: false
  },
  {
    id: 'rv-palmer',
    mmsi: 367013890,
    callSign: 'WBP3210',
    name: 'R/V NATHANIEL B. PALMER',
    flag: '🇺🇸 USA / NSF',
    iceClass: 'PC5',
    iceClassName: 'Polar Class 5 (Year-Round Medium First-Year Ice)',
    type: 'Antarctic Research Icebreaker',
    lengthMeters: 94.0,
    beamMeters: 18.3,
    draftMeters: 6.9,
    position: [-64.7742, -64.0531],
    sogKnots: 10.2,
    cogDeg: 210.0,
    headingDeg: 208,
    navStatus: 'Underway using Engine',
    destination: 'Palmer Station (Anvers Island)',
    eta: '2026-03-01 12:00 UTC',
    fuelType: 'Marine Gas Oil',
    isFlagship: false
  },
  {
    id: 'rv-agulhas',
    mmsi: 601000123,
    callSign: 'ZR6789',
    name: 'S.A. AGULHAS II',
    flag: '🇿🇦 South Africa / SANAP',
    iceClass: 'PC5',
    iceClassName: 'Polar Class 5 (Medium First-Year Ice)',
    type: 'Polar Supply & Research Vessel',
    lengthMeters: 134.2,
    beamMeters: 21.7,
    draftMeters: 7.7,
    position: [-69.8500, -2.8500],
    sogKnots: 9.8,
    cogDeg: 35.0,
    headingDeg: 37,
    navStatus: 'Icebreaking Transit',
    destination: 'SANAE IV Base (Queen Maud Land)',
    eta: '2026-03-05 22:00 UTC',
    fuelType: 'Heavy Polar Fuel / MGO',
    isFlagship: false
  },
  {
    id: 'rv-fedorov',
    mmsi: 273111000,
    callSign: 'UERR',
    name: 'AKADEMIK FEDOROV',
    flag: '🇷🇺 Russia / AARI',
    iceClass: 'PC3',
    iceClassName: 'Polar Class 3 (Year-Round Second-Year Ice)',
    type: 'Polar Expedition Icebreaker',
    lengthMeters: 141.2,
    beamMeters: 25.6,
    draftMeters: 8.5,
    position: [-66.5500, 93.0100],
    sogKnots: 12.0,
    cogDeg: 295.0,
    headingDeg: 298,
    navStatus: 'Underway using Engine',
    destination: 'Mirny Station / Progress Base',
    eta: '2026-03-06 14:00 UTC',
    fuelType: 'MGO',
    isFlagship: false
  }
];

function getFleetVessels() {
  return POLAR_FLEET;
}

function getVesselById(id) {
  return POLAR_FLEET.find((v) => v.id === id) || POLAR_FLEET[0];
}

module.exports = {
  POLAR_FLEET,
  getFleetVessels,
  getVesselById
};
