// sponsorModel.js
const { getContainer } = require('../config/cosmosClient');
const container = () => getContainer('Sponsors');

const getAllSponsors = async () => {
  const query = 'SELECT * FROM c WHERE c.status != "inactive"';
  const { resources } = await container().items.query(query).fetchAll();
  return resources;
};

const getSponsorById = async (id) => {
  try {
    const { resource } = await container().item(id, id).read();
    return resource;
  } catch {
    return null;
  }
};

const createSponsor = async (sponsor) => {
  sponsor.status = 'active';
  sponsor.createdAt = new Date().toISOString();
  const { resource } = await container().items.create(sponsor);
  return resource;
};

const updateSponsor = async (id, data) => {
  const existing = await getSponsorById(id);
  if (!existing) throw new Error('Sponsor not found');
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
  const { resource } = await container().items.upsert(updated);
  return resource;
};

const deactivateSponsor = async (id) => {
  const sponsor = await getSponsorById(id);
  if (!sponsor) throw new Error('Sponsor not found');
  sponsor.status = 'inactive';
  sponsor.deactivatedAt = new Date().toISOString();
  const { resource } = await container().items.upsert(sponsor);
  return resource;
};

module.exports = {
  getAllSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deactivateSponsor,
};
