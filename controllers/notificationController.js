// controllers/notificationController.js
// const {fetch} = require('node-fetch');
const axios = require('axios');
const {
  sendNotification,
  getNotificationsByEmail,
  getAllNotifications,
  markAllAsRead,
} = require('../models/notificationModel');
const { setPlayerId, getPlayerId } = require('../models/userModel');
const ONE_SIGNAL_APP_ID = '6020aad9-e6e5-45bd-b600-64deaeb81b69';
const ONE_SIGNAL_REST_KEY = 'os_v2_app_maqkvwpg4vc33nqamtpk5oa3ngc6waq64jheeb5vnjkvb5irjpxdvojxqv673fmc4c7jvfnyhkwph7iowfuej64xmufzljcduvoepei';
const savePlayerId = async (req, res, next) => {
  try {
    const { email, playerId } = req.body;
    if (!email || !playerId) return res.status(400).json({ message: 'Missing field' });

    await setPlayerId(email, playerId);
    res.status(200).json({ message: 'Player ID saved' });
  } catch (err) {
    next(err);
  }
};

const handleSendNotification = async (req, res, next) => {
  try {
    const { title, message, email } = req.body;
    if (!title || !message || !email) {
      return res.status(400).json({ message: 'Missing field' });
    }

    // Save to internal DB (optional step)
    await sendNotification({ title, message, email });

    // Get OneSignal player ID
    const playerId = await getPlayerId(email);

    if (playerId) {
      await axios.post('https://onesignal.com/api/v1/notifications', {
        app_id: ONE_SIGNAL_APP_ID,
        include_player_ids: [playerId],
        headings: { en: title },
        contents: { en: message },
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${ONE_SIGNAL_REST_KEY}`,
        },
      });
    }

    res.status(201).json({ message: 'Notification sent' });
  } catch (err) {
    next(err);
  }
};

const handleFetchNotifications = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (email) {
      const list = await getNotificationsByEmail(email);
      return res.json(list);
    } else {
      const list = await getAllNotifications();
      return res.json(list);
    }
  } catch (err) {
    next(err);
  }
};

const handleMarkAllRead = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    await markAllAsRead(email);
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  handleSendNotification,
  handleFetchNotifications,
  handleMarkAllRead,
  savePlayerId 
};
