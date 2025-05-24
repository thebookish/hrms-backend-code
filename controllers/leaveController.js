// leaveController.js
const {
    createLeaveRequest,
    getAllLeaveRequests,
    getLeaveRequestsByEmployeeId,
    updateLeaveStatus,
  } = require('../models/leaveModel');
  
  const submitLeaveRequest = async (req, res, next) => {
    try {
      const { reason, startDate, endDate } = req.body;
      const leave = await createLeaveRequest({
        employeeId: req.user.id,
        reason,
        startDate,
        endDate,
      });
      res.status(201).json({ message: 'Leave request submitted', leave });
    } catch (err) {
      next(err);
    }
  };
  
  const viewOwnLeaves = async (req, res, next) => {
    try {
      const leaves = await getLeaveRequestsByEmployeeId(req.user.id);
      res.json(leaves);
    } catch (err) {
      next(err);
    }
  };
  
  const viewAllLeaves = async (req, res, next) => {
    try {
      const leaves = await getAllLeaveRequests();
      res.json(leaves);
    } catch (err) {
      next(err);
    }
  };
  
  const approveLeave = async (req, res, next) => {
    try {
      const leave = await updateLeaveStatus(req.params.id, 'approved');
      res.json({ message: 'Leave approved', leave });
    } catch (err) {
      next(err);
    }
  };
  
  const rejectLeave = async (req, res, next) => {
    try {
      const leave = await updateLeaveStatus(req.params.id, 'rejected');
      res.json({ message: 'Leave rejected', leave });
    } catch (err) {
      next(err);
    }
  };
  
  module.exports = {
    submitLeaveRequest,
    viewOwnLeaves,
    viewAllLeaves,
    approveLeave,
    rejectLeave,
  };
  