const { getFleetVessels, getVesselById } = require('../services/aisService');

const getFleet = async (req, res, next) => {
  try {
    const vessels = getFleetVessels();
    return res.json({
      count: vessels.length,
      fleet: vessels,
      source: 'Antarctic AIS Polar Fleet Transponder Network'
    });
  } catch (err) {
    next(err);
  }
};

const getVessel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vessel = getVesselById(id);
    return res.json({
      vessel,
      source: 'AIS Transponder'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFleet,
  getVessel
};
