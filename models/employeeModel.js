// employeeModel.js
const { getContainer } = require('../config/cosmosClient');
const container = () => getContainer('Employees');

const getApprovedEmployees = async () => {
  const query = 'SELECT * FROM c WHERE c.status = "approved"';
  const { resources } = await container().items.query(query).fetchAll();
  return resources;
};
const getPendingEmployees = async () => {
  const query = 'SELECT * FROM c WHERE c.status = "pending" OR c.status = "declined"';
  const { resources } = await container().items.query(query).fetchAll();
  return resources;
};

const getEmployeeByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM c WHERE c.email = @email';
    const parameters = [{ name: '@email', value: email }];
    const { resources } = await container().items
      .query({ query, parameters })
      .fetchAll();

    return resources.length > 0 ? resources[0] : null;
  } catch (err) {
    console.error('Error fetching employee:', err);
    return null;
  }
};


const createEmployee = async (employee) => {
  employee.status = 'pending';
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

// const approveEmployee = async (id) => {
//   const employee = await getEmployeeById(id);
//   if (!employee) throw new Error('Employee not found');
//   employee.status = 'approved';
//   const { resource } = await container().items.upsert(employee);
//   return resource;
// };

module.exports = {
  getPendingEmployees,
  getApprovedEmployees,
  getEmployeeByEmail,
  createEmployee,
  updateEmployee,
  // approveEmployee ,
};
