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

const getEmployeeByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await findEmployeeByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build the response data based on your schema
    const employeeData = {
      fullName: user.fullName || '',
      phone: user.phone || '',
      email: user.email || '',
      dob: user.dob || '',
      family: user.family || '',
      emergency: user.emergency || '',
      nationality: user.nationality || '',
      gender: user.gender || '',
      id: user.id || '',
      sponsor: user.sponsor || '',
      joinDate: user.joinDate || '',
      endDate: user.endDate || '',
      jobType: user.jobType || '',
      bank: user.bank || '',
      salary: user.salary || '',
      sickLeave: user.sickLeave||'',
      casualLeave: user.casualLeave||'',
      paidLeave: user.paidLeave||'',
      passportPath: user.passportPath || null,
      sponsorPath: user.sponsorPath || null,
      status: user.status || 'pending', // include status if available
      // profilePic: user.profilePic || null, // optional field if used in UI
    };

    return res.status(200).json(employeeData);
  } catch (err) {
    next(err);
  }
};

const findEmployeeByEmail = async (email) => {
  const { resources } = await container().items
    .query({ query: 'SELECT * FROM c WHERE c.email = @email', parameters: [{ name: '@email', value: email }] })
    .fetchAll();
  return resources[0];
};



const createEmployee = async (employee) => {
  employee.status = 'pending';
  const { resource } = await container().items.create(employee);
  return resource;
};

const updateEmployee = async (email, data) => {
  const existing = await getEmployeeByEmail(email);
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
  findEmployeeByEmail,
  createEmployee,
  updateEmployee,
  getEmployeeByEmail
  // approveEmployee ,
};
