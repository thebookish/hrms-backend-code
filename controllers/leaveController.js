// leaveController.js
const {
    createLeaveRequest,
    getAllLeaveRequests,
    updateLeaveStatus,
    updateLeaveBalance,
    getLeaveBalance
  } = require('../models/leaveModel');
  const { getContainer } = require('../config/cosmosClient');
  const dayjs = require('dayjs'); 
  const container = () => getContainer('Leaves');
  
  const applyLeave = async (req, res, next) => {
    try {
      const { email, type, fromDate, toDate, reason, status = 'Pending' } = req.body;
  
      if (!email || !type || !fromDate || !toDate || !reason) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const daysRequested = dayjs(toDate).diff(dayjs(fromDate), 'day') + 1;
      const balance = await getLeaveBalance(email);
  
      if (!balance || balance[type.toLowerCase()] === undefined) {
        return res.status(400).json({ message: 'Invalid or missing leave balance' });
      }
  
      if (balance[type.toLowerCase()] < daysRequested) {
        return res.status(400).json({ message: `Insufficient leave balance for ${type}` });
      }
  
      // Leave data
      const leaveData = {
        email,
        type,
        fromDate,
        toDate,
        reason,
        status,
        requestedAt: new Date().toISOString(),
        daysRequested
      };
  
      const newLeave = await createLeaveRequest(leaveData);
  
      res.status(201).json({ message: 'Leave request submitted', leave: newLeave });
    } catch (err) {
      next(err);
    }
  };
  const getLeaves = async (req, res, next) => {
    try {
      const { email } = req.query;
  
      let query;
      let parameters = [];
  
      if (email) {
        query = 'SELECT * FROM c WHERE c.email = @email ORDER BY c.createdAt DESC';
        parameters.push({ name: '@email', value: email });
      } else {
        query = 'SELECT * FROM c ORDER BY c.createdAt DESC';
      }
  
      const { resources } = await container().items
        .query({ query, parameters })
        .fetchAll();
  
      res.status(200).json(resources);
    } catch (err) {
      next(err);
    }
  };
  const getLeaveBalanceAPI = async (req, res, next) => {
    try {
      const { email } = req.query;
      if (!email) return res.status(400).json({ message: 'Email required' });
  
      const balance = await getLeaveBalance(email);
      res.json({ email, balance });
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
      const leave = await updateLeaveStatus(req.params.email, 'approved');
  
      // Deduct leave balance
      await updateLeaveBalance(leave.email, leave.type.toLowerCase(), leave.daysRequested);
  
      res.json({ message: 'Leave approved and balance updated', leave });
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
    applyLeave,
    getLeaves,
    viewAllLeaves,
    approveLeave,
    rejectLeave,
    getLeaveBalanceAPI
  };
  