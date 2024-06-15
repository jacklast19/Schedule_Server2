const express = require('express');
const router = express.Router();
const User = require('../models/user');

// ลงทะเบียนผู้ใช้ใหม่
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

// อัพเดตข้อมูลผู้ใช้
router.patch('/update/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, password, email, firstName, lastName, department, role, status } = req.body;
    if (username != null) user.username = username;
    if (password != null) user.password = password;
    if (email != null) user.email = email;
    if (firstName != null) user.firstName = firstName;
    if (lastName != null) user.lastName = lastName;
    if (department != null) user.department = department;
    if (role != null) user.role = role;
    if (status != null) user.status = status;
    
    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ดึงข้อมูลผู้ใช้ที่อยู่ในสถานะ pending
router.get('/pending', async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.remove();
    res.json({ message: 'Deleted User' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a user by username
router.get('/user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
