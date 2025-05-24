// leaveModel.js
const { getContainer } = require('../config/cosmosClient');
const container = () => getContainer('Leaves');

const createLeaveRequest = async (leave) => {
  leave.status = 'pending';
  leave.requestedAt = new Date().toISOString();
  const { resource } = await container().items.create(leave);
  return resource;
};

const getAllLeaveRequests = async () => {
  const { resources } = await container().items
    .query('SELECT * FROM c ORDER BY c.requestedAt DESC')
    .fetchAll();
  return resources;
};

const getLeaveRequestsByEmployeeId = async (employeeId) => {
  const { resources } = await container().items
    .query({
      query: 'SELECT * FROM c WHERE c.employeeId = @employeeId ORDER BY c.requestedAt DESC',
      parameters: [{ name: '@employeeId', value: employeeId }],
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
