// sponsorController.js
const {
    getAllSponsors,
    getSponsorById,
    createSponsor,
    updateSponsor,
    deactivateSponsor,
  } = require('../models/sponsorModel');
  
  const listSponsors = async (req, res, next) => {
    try {
      const sponsors = await getAllSponsors();
      res.json(sponsors);
    } catch (err) {
      next(err);
    }
  };
  
  const viewSponsor = async (req, res, next) => {
    try {
      const sponsor = await getSponsorById(req.params.id);
      if (!sponsor) return res.status(404).json({ message: 'Sponsor not found' });
      res.json(sponsor);
    } catch (err) {
      next(err);
    }
  };
  
  const addSponsor = async (req, res, next) => {
    try {
      const sponsor = await createSponsor(req.body);
      res.status(201).json({ message: 'Sponsor added', sponsor });
    } catch (err) {
      next(err);
    }
  };
  
  const editSponsor = async (req, res, next) => {
    try {
      const sponsor = await updateSponsor(req.params.id, req.body);
      res.json({ message: 'Sponsor updated', sponsor });
    } catch (err) {
      next(err);
    }
  };
  
  const removeSponsor = async (req, res, next) => {
    try {
      const sponsor = await deactivateSponsor(req.params.id);
      res.json({ message: 'Sponsor deactivated', sponsor });
    } catch (err) {
      next(err);
    }
  };
  
  module.exports = {
    listSponsors,
    viewSponsor,
    addSponsor,
    editSponsor,
    removeSponsor,
  };
  