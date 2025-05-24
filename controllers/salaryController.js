// salaryController.js
const {
    getSalaryByEmployeeId,
    addOrUpdateSalary,
    getAllSalaries,
  } = require('../models/salaryModel');
  
  const viewOwnSalaryHistory = async (req, res, next) => {
    try {
      const salaries = await getSalaryByEmployeeId(req.user.id);
      res.json(salaries);
    } catch (err) {
      next(err);
    }
  };
  
  const viewAllSalaries = async (req, res, next) => {
    try {
      const salaries = await getAllSalaries();
      res.json(salaries);
    } catch (err) {
      next(err);
    }
  };
  
  const updateSalary = async (req, res, next) => {
    try {
      const { employeeId, base, bonus, allowances } = req.body;
      if (!employeeId || !base) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const salary = await addOrUpdateSalary(employeeId, { base, bonus, allowances });
      res.status(201).json({ message: 'Salary record updated', salary });
    } catch (err) {
      next(err);
    }
  };
  
  module.exports = {
    viewOwnSalaryHistory,
    viewAllSalaries,
    updateSalary,
  };
  