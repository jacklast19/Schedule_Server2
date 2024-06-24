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
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
    res.json({ 
      token,
      username: user.username,
      role: user.role,
      department: user.department,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
