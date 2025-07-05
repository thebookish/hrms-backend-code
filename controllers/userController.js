// controllers/userController.js
const { findUserByEmail, updateUserProfile, updateUserProfilePic } = require('../models/userModel');

const updateProfile = async (req, res, next) => {
  try {
    const { email } = req.query; 
    const { name, phone, department, position } = req.body;

    const updatedUser = await updateUserProfile(email, {
      name,
      phone,
      department,
      position,
    });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    next(err);
  }
};


const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const {
      id,
      name,
      email: userEmail,
      phone = '',
      position = '',
      department = '',
      joinDate = '',
      profilePic='',
      notifications = [],
      role,
    } = user;
    const profilePicUrl = profilePic
    ? `https://backend-hrm-cwbfc6cwbwbbdhae.southeastasia-01.azurewebsites.net${profilePic}`
    : '';
    res.status(200).json({
      id,
      name,
      email: userEmail,
      phone,
      position,
      department,
      joinDate,
      profilePic:profilePicUrl,
      notifications,
      role,
    });
  } catch (err) {
    next(err);
  }
};
const updateProfilePic = async (req, res, next) => {
  try {
    const email = req.query; 
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const imagePath = `/uploads/profile_pics/${file.filename}`;

    await updateUserProfilePic(email, imagePath);
    res.json({ message: 'Profile picture updated', imageUrl: imagePath });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserByEmail , updateProfile, updateProfilePic};
