// leaveModel.js
const { getContainer } = require('../config/cosmosClient');
const container = () => getContainer('Leaves');

const createLeaveRequest = async (leaveData) => {
  const id = `${leaveData.email}-${Date.now()}`;
  const newLeave = { id, ...leaveData };
  await container().items.create(newLeave);
  return newLeave;
};

const getAllLeaveRequests = async () => {
  const { resources } = await container().items
    .query('SELECT * FROM c ORDER BY c.requestedAt DESC')
    .fetchAll();
  return resources;
};

const getLeaveRequestsByEmployeeId = async (email) => {
  const { resources } = await container().items
    .query({
      query: 'SELECT * FROM c WHERE c.email = @email ORDER BY c.requestedAt DESC',
      parameters: [{ name: '@email', value: email }],
    })
    .fetchAll();
  return resources;
};

const updateLeaveStatus = async (id, newStatus) => {
  const { resource: existing } = await container().item(id, id).read();
  if (!existing) throw new Error('Leave request not found');

  existing.status = newStatus;
  existing.reviewedAt = new Date().toISOString();

  const { resource: updated } = await container().items.upsert(existing);
  return updated;
};

module.exports = {
  createLeaveRequest,
  getAllLeaveRequests,
  getLeaveRequestsByEmployeeId,
  updateLeaveStatus,
};
