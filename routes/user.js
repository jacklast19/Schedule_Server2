const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Employee = require('../models/Employee'); // Model สำหรับ Employee (หากมีข้อมูลเพิ่มเติม)
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');

/**
 * สมัครสมาชิก (Register)
 * รับข้อมูล: 
 *  - username, password, confirmPassword, role, department (optional)
 *  - employee: (object) ข้อมูลพนักงาน ถ้ามี ส่งเข้ามาเพื่อนำไปสร้าง record ใน Employee
 */
router.post('/register', async (req, res) => {
  try {
    const { 
      username, 
      password, 
      confirmPassword, 
      role, 
      department, 
      employee 
    } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็นต้องมี
    if (!username || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: 'กรุณาระบุข้อมูลให้ครบ' });
    }

    // ตรวจสอบความตรงกันของ password กับ confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password และ Confirm Password ไม่ตรงกัน' });
    }

    // ตรวจสอบว่า username นี้มีอยู่แล้วหรือไม่
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username นี้มีอยู่แล้ว' });
    }

    // ถ้ามีข้อมูล employee ส่งเข้ามา ให้สร้าง record ใน collection Employee
    let employeeRecord = null;
    if (employee) {
      employeeRecord = new Employee(employee);
      await employeeRecord.save();
    }

    // สร้าง user ใหม่ (รหัสผ่านจะถูกแฮชใน pre-save middleware)
    const newUser = new User({
      username,
      password, // จะถูกเข้ารหัสใน pre-save
      role,
      department,
      status: 'inactive', // ค่าเริ่มต้น อาจแก้เป็น 'pending' ตามนโยบายได้
      employeeId: employeeRecord ? employeeRecord._id : undefined
    });

    await newUser.save();
    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * เข้าสู่ระบบ (Login)
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'กรุณาระบุ username และ password' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }
    // หากใช้ JWT สามารถสร้าง token แล้วส่งกลับไปได้
    res.json({ message: 'เข้าสู่ระบบสำเร็จ', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Update user
 * ใช้ middleware authenticateToken และ authorizeRoles สำหรับ role: IT, HR, Board, Head
 */
router.patch('/update/:id', authenticateToken, authorizeRoles('IT', 'HR', 'Board', 'Head'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { username, password, role, department, status, employeeId } = req.body;
    if (username != null) user.username = username;
    if (password != null) user.password = password; // จะถูกเข้ารหัสใน pre-save
    if (role != null) user.role = role;
    if (department != null) user.department = department;
    if (status != null) user.status = status;
    if (employeeId != null) user.employeeId = employeeId;

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * ดึงข้อมูลผู้ใช้ที่มีสถานะ inactive
 */
router.get('/inactive', authenticateToken, authorizeRoles('IT', 'HR', 'Board', 'Head'), async (req, res) => {
  try {
    const users = await User.find({ status: 'inactive' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ดึงข้อมูลผู้ใช้ที่มีสถานะ active
 */
router.get('/active', authenticateToken, authorizeRoles('IT', 'HR', 'Board', 'Head'), async (req, res) => {
  try {
    const users = await User.find({ status: 'active' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ดึงข้อมูลผู้ใช้ทั้งหมด
 */
router.get('/', authenticateToken, authorizeRoles('IT', 'HR', 'Board', 'Head'), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ดึงข้อมูลผู้ใช้รายคน (โดย ID)
 */
router.get('/:id', authenticateToken, authorizeRoles('IT', 'HR', 'Board', 'Head'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ลบผู้ใช้ (โดย ID)
 */
router.delete('/:id', authenticateToken, authorizeRoles('IT', 'HR', 'Board', 'Head'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.remove();
    res.json({ message: 'Deleted User' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ดึงข้อมูลผู้ใช้ตาม username
 */
router.get('/user/:username', authenticateToken, authorizeRoles('IT', 'HR', 'Board', 'Head'), async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ค้นหาผู้ใช้โดยใช้ username ผ่าน query parameter "username"
 */
router.get('/search', authenticateToken, authorizeRoles('IT', 'HR', 'Board', 'Head'), async (req, res) => {
  try {
    const { username } = req.query;
    const condition = username ? { username: { $regex: new RegExp(`^${username}$`, 'i') } } : {};
    const users = await User.find(condition);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
