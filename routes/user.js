const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');


router.patch('/update/:id',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'),async (req, res) => {
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
    if (hipId != null) user.hipId = hipId;
    
    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ดึงข้อมูลผู้ใช้ที่อยู่ในสถานะ pending
router.get('/pending',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'),async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ดึงข้อมูลผู้ใช้ที่อยู่ในสถานะ active
router.get('/active',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'),async (req, res) => {
  try {
    const users = await User.find({ status: 'active' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single user by ID
router.get('/:id',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), async (req, res) => {
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
router.delete('/:id',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), async (req, res) => {
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
router.get('/user/:username',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD') ,async (req, res) => {
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

// Find users by first name
router.get('/users',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'),  (req, res) => {
  const firstname = req.query.firstname;
  const condition = firstname ? { firstName: { $regex: new RegExp(`^${firstname}$`, 'i') } } : {};

  userAll.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
});

module.exports = router;
