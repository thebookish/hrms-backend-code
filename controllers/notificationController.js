// notificationController.js
const {
    getAllPreferences,
    getPreferenceByEmployeeId,
    upsertPreference,
  } = require('../models/notificationModel');
  
  // Admin: View all preferences
  const listNotificationPreferences = async (req, res, next) => {
    try {
      const prefs = await getAllPreferences();
      res.json(prefs);
    } catch (err) {
      next(err);
    }
  };
  
  // Employee: View own preferences
  const getOwnPreference = async (req, res, next) => {
    try {
      const pref = await getPreferenceByEmployeeId(req.user.id);
      res.json(pref || {});
    } catch (err) {
      next(err);
    }
  };
  
  // Admin/Employee: Set/update preferences
  const setPreference = async (req, res, next) => {
    try {
      const data = {
        employeeId: req.user.role === 'admin' ? req.body.employeeId : req.user.id,
        channels: req.body.channels, // e.g., ['email', 'push']
        reminderDays: req.body.reminderDays, // e.g., [1, 3, 7]
      };
      const saved = await upsertPreference(data);
      res.status(201).json({ message: 'Preferences saved', saved });
    } catch (err) {
      next(err);
    }
  };
  
  module.exports = {
    listNotificationPreferences,
    getOwnPreference,
    setPreference,
  };
  