// employeeController.js
const {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deactivateEmployee,
  } = require('../models/employeeModel');
  
  const listEmployees = async (req, res, next) => {
    try {
      const employees = await getAllEmployees();
      res.json(employees);
    } catch (err) {
      next(err);
    }
  };
  
  const getEmployee = async (req, res, next) => {
    try {
      const employee = await getEmployeeById(req.params.id);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      res.json(employee);
    } catch (err) {
      next(err);
    }
  };
  
  const addEmployee = async (req, res, next) => {
    try {
      const employee = await createEmployee(req.body);
      res.status(201).json({ message: 'Employee created', employee });
    } catch (err) {
      next(err);
    }
  };
  
  const editEmployee = async (req, res, next) => {
    try {
      const employee = await updateEmployee(req.params.id, req.body);
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
    listEmployees,
    getEmployee,
    addEmployee,
    editEmployee,
    disableEmployee,
  };
  