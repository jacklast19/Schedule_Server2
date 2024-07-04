const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const jwtSecret = 'schedule_jwt_secret'; // ควรเก็บเป็นความลับและไม่เผยแพร่ในโค้ด

// ลงทะเบียน
router.post('/register', async (req, res) => {
  const { username, firstName, lastName, password, department } = req.body;
  try {
    const user = new User({ username, firstName, lastName, password, department, status: 'pending' });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ล็อกอิน
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'User is not active' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
    res.json({ 
      token,
      username: user.username,
      role: user.role,
      department: user.department,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Middleware สำหรับตรวจสอบ JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Middleware สำหรับตรวจสอบสิทธิ์
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRole
};


