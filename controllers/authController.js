// authController.js
const { findUserByEmail, createUser } = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/token');
const crypto = require('crypto');
const { sendResetEmail,sendEmail } = require('../utils/email'); // You'll create this
const { updatePassword, findUserByOtp, setResetOtp} = require('../models/userModel');
const { setOtp, getOtp, deleteOtp } = require('../models/otpModel');
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone='',
      position='',
      department='',
      joinDate='', // e.g. "2024-01-10"
      profilePic='',
      role = 'employee' // default role
    } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await hashPassword(password);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      phone,
      position,
      department,
      joinDate,
      profilePic,
      role,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        position: newUser.position,
        department: newUser.department,
        joinDate: newUser.joinDate,
        profilePic: newUser.profilePic,
        role: newUser.role,
      }
    });
  } catch (err) {
    next(err);
  }
};
// Generate a random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = generateOtp();
  setOtp(email, otp);

  try {
    await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  // ✅ Await the promise
  const record = await getOtp(email);
  console.log(email);

  console.log('Type of record:', typeof record);
  console.log('Raw record:', record);

  if (!record || typeof record !== 'object') {
    return res.status(400).json({ message: 'OTP expired or not found' });
  }

  if (Date.now() > record.expiresAt) {
    await deleteOtp(email);
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (String(record.otp) === String(otp)) {
    await deleteOtp(email);
    return res.status(200).json({ message: 'OTP verified' });
  } else {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
};



const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

// Step 1: Send OTP to email
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expires = Date.now() + 10 * 60 * 1000; // 10 min expiry

    await setResetOtp(email, otp, expires);

    await sendResetEmail(email, `Your OTP to reset password is: ${otp}`);

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    next(err);
  }
};

// Step 2: Verify OTP and Reset Password
const resetPasswordWithOtp = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    const user = await findUserByOtp(email, otp);
    if (!user || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashed = await hashPassword(password);
    await updatePassword(email, hashed);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

// Change Password
const changePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await findUserByEmail(email);

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    // user.password = hashedNewPassword;

    await updatePassword(email, hashedNewPassword);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Logout successful (stateless)' });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  register,
  sendOtp,
  verifyOtp,
  login,
  logout,
  changePassword,
  forgotPassword,
  resetPasswordWithOtp
};
