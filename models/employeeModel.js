// employeeModel.js
const { getContainer } = require('../config/cosmosClient');
const container = () => getContainer('Employees');

const getAllEmployees = async () => {
  const query = 'SELECT * FROM c WHERE c.status != "inactive"';
  const { resources } = await container().items.query(query).fetchAll();
  return resources;
};

const getEmployeeById = async (id) => {
  try {
    const { resource } = await container().item(id, id).read();
    return resource;
  } catch (err) {
    return null;
  }
};

const createEmployee = async (employee) => {
  employee.status = 'active';
  const { resource } = await container().items.create(employee);
  return resource;
};

const updateEmployee = async (id, data) => {
  const existing = await getEmployeeById(id);
  if (!existing) throw new Error('Employee not found');
  const updated = { ...existing, ...data };
  const { resource } = await container().items.upsert(updated);
  return resource;
};

const deactivateEmployee = async (id) => {
  const employee = await getEmployeeById(id);
  if (!employee) throw new Error('Employee not found');
  employee.status = 'inactive';
  const { resource } = await container().items.upsert(employee);
  return resource;
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
};
