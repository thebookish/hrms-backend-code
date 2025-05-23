// authController.js
const { findUserByEmail, createUser } = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/token');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashed = await hashPassword(password);
    const newUser = await createUser({ name, email, password: hashed, role });

    res.status(201).json({ message: 'User registered', user: { id: newUser.id, email: newUser.email, role } });
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

module.exports = { register, login };
