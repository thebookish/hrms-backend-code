// controllers/sponsorController.js

const { getContainer } = require('../config/cosmosClient');
const {
  getSponsorByEmail,
  updateSponsor,
} = require('../models/sponsorModel');
const container = () => getContainer('Sponsors');

const addSponsor = async (req, res, next) => {
  try {
    const {
      name,
      industry,
      contactPerson,
      email,
      phone,
      address,
      logoUrl,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const sponsorData = {
      id: `${Date.now()}-${email}`,
      name,
      industry,
      contactPerson,
      email,
      phone,
      address,
      logoUrl,
      createdAt: new Date().toISOString(),
    };

    const { resource } = await container().items.create(sponsorData);
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
};
// Fetch sponsor by email
const handleFetchSponsor = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const sponsor = await getSponsorByEmail(email);
    if (!sponsor) return res.status(404).json({ message: 'Sponsor not found' });

    res.json(sponsor);
  } catch (err) {
    next(err);
  }
};

// Update sponsor
const handleUpdateSponsor = async (req, res, next) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ message: 'Email is required in URL' });

    const updatedData = req.body;

    const sponsor = await updateSponsor(email, updatedData);
    res.json(sponsor);
  } catch (err) {
    next(err);
  }
};
module.exports = {
  addSponsor,
  handleUpdateSponsor,
  handleFetchSponsor
};
