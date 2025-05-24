// salaryModel.js
const { getContainer } = require('../config/cosmosClient');
const container = () => getContainer('Salaries');

const getSalaryByEmployeeId = async (employeeId) => {
  const { resources } = await container().items
    .query({
      query: 'SELECT * FROM c WHERE c.employeeId = @employeeId ORDER BY c.updatedAt DESC',
      parameters: [{ name: '@employeeId', value: employeeId }],
    })
    .fetchAll();
  return resources;
};

const addOrUpdateSalary = async (employeeId, data) => {
  const salaryRecord = {
    id: `${employeeId}-${Date.now()}`,
    employeeId,
    base: data.base,
    bonus: data.bonus || 0,
    allowances: data.allowances || [],
    total: (data.base + (data.bonus || 0) + (data.allowances?.reduce((a, b) => a + b.amount, 0) || 0)),
    updatedAt: new Date().toISOString(),
  };
  const { resource } = await container().items.create(salaryRecord);
  return resource;
};

const getAllSalaries = async () => {
  const { resources } = await container().items.query('SELECT * FROM c').fetchAll();
  return resources;
};

module.exports = {
  getSalaryByEmployeeId,
  addOrUpdateSalary,
  getAllSalaries,
};
