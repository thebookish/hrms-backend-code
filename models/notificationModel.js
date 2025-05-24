// notificationModel.js
const { getContainer } = require('../config/cosmosClient');
const container = () => getContainer('Notifications');

const getAllPreferences = async () => {
  const { resources } = await container().items.query('SELECT * FROM c').fetchAll();
  return resources;
};

const getPreferenceByEmployeeId = async (employeeId) => {
  const query = {
    query: 'SELECT * FROM c WHERE c.employeeId = @employeeId',
    parameters: [{ name: '@employeeId', value: employeeId }],
  };
  const { resources } = await container().items.query(query).fetchAll();
  return resources[0];
};

const upsertPreference = async (data) => {
  const existing = await getPreferenceByEmployeeId(data.employeeId);
  const newRecord = {
    ...(existing || {}),
    ...data,
    updatedAt: new Date().toISOString(),
  };
  newRecord.id = newRecord.id || `${data.employeeId}`;
  const { resource } = await container().items.upsert(newRecord);
  return resource;
};

module.exports = {
  getAllPreferences,
  getPreferenceByEmployeeId,
  upsertPreference,
};
