// authController.js
const { findUserByEmail, createUser } = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/token');
const crypto = require('crypto');
const { sendResetEmail } = require('../utils/email'); // You'll create this
const { updatePassword, findUserByOtp, setResetOtp} = require('../models/userModel');

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
        role: newUser.role,
      }
    });
  } catch (err) {
    next(err);
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

module.exports = {
  register,
  login,
  forgotPassword,
  resetPasswordWithOtp
};
