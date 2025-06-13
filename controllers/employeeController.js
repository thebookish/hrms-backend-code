// employeeController.js
const {
    getPendingEmployees,
    getApprovedEmployees,
    createEmployee,
    updateEmployee,
  } = require('../models/employeeModel');
  const { getContainer } = require('../config/cosmosClient');
  const container = () => getContainer('Employees');
  
  const listPendingEmployees = async (req, res, next) => {
    try {
      const employees = await getPendingEmployees();
      res.json(employees);
    } catch (err) {
      next(err);
    }
  };
  const listApprovedEmployees = async (req, res, next) => {
    try {
      const employees = await getApprovedEmployees();
      res.json(employees);
    } catch (err) {
      next(err);
    }
  };
  const getEmployee = async (req, res, next) => {
    try {
      const employee = await getEmployeeByEmail(req.params.id);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      res.json(employee);
    } catch (err) {
      next(err);
    }
  };

  const approveEmployee = async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) return res.status(400).json({ message: 'Email is required' });
  
      const employee = await getEmployeeByEmail(email);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
  
      employee.status = 'approved';
      const { resource } = await container().items.upsert(employee);
  
      res.status(200).json({ message: 'Employee approved', employee: resource });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  const declineEmployee = async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) return res.status(400).json({ message: 'Email is required' });
  
      const employee = await getEmployeeByEmail(email);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
  
      employee.status = 'declined';
      const { resource } = await container().items.upsert(employee);
  
      res.status(200).json({ message: 'Employee declined', employee: resource });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  const addEmployee = async (req, res, next) => {
    try {
      const {
        fullName, phone, email, dob, family, emergency,
        nationality, gender, id, sponsor, joinDate, endDate,
        jobType, bank, salary,
      } = req.body;
  
      const passportFile = req.files['passport']?.[0];
      const sponsorFile = req.files['sponsor']?.[0];
  
      const employeeData = {
        fullName,
        phone,
        email,
        dob,
        family,
        emergency,
        nationality,
        gender,
        id,
        sponsor,
        joinDate,
        endDate,
        jobType,
        bank,
        salary,
        passportPath: passportFile ? `/uploads/employees/${passportFile.filename}` : null,
        sponsorPath: sponsorFile ? `/uploads/employees/${sponsorFile.filename}` : null,
      };
  
      const employee = await createEmployee(employeeData);
  
      res.status(201).json({ message: 'Employee created', employee });
    } catch (err) {
      next(err);
    }
  };
  
  const editEmployee = async (req, res, next) => {
    try {
      const { email } = req.query;
      const employee = await updateEmployee(email, req.body);
      res.json({ message: 'Employee updated', employee });
    } catch (err) {
      next(err);
    }
  };
  
  const disableEmployee = async (req, res, next) => {
    try {
      const employee = await deactivateEmployee(req.params.id);
      res.json({ message: 'Employee deactivated', employee });
    } catch (err) {
      next(err);
    }
  };

  
  
  module.exports = {
    listPendingEmployees,
    listApprovedEmployees,
    getEmployee,
    addEmployee,
    approveEmployee ,
    editEmployee,
    disableEmployee,
    declineEmployee 
  };
  