//ไฟล์ /routes/user.js เป็นไฟล์ที่เกี่ยวข้องกับการจัดการข้อมูลผู้ใช้
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '8h';

router.post('/register', async (req, res) => {
  try {
    const { 
      username, 
      password, 
      confirmPassword, 
      role, 
      department, 
      //employeeId // ส่ง ObjectId ของ employee (optional)
    } = req.body;

    if (!username || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: 'กรุณาระบุข้อมูลให้ครบ' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password และ Confirm Password ไม่ตรงกัน' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username นี้มีอยู่แล้ว' });
    }

    // ตรวจสอบว่า employeeId ที่ให้มา (ถ้ามี) มีอยู่จริงไหม
    let employeeRef = null;
    if (employeeId) {
      const foundEmployee = await Employee.findById(employeeId);
      if (!foundEmployee) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลพนักงานที่ระบุ' });
      }
      employeeRef = foundEmployee._id;
    }

    // ถ้าเป็น board → ไม่ต้องมี employeeId หรือ department
    const userData = {
      username,
      password,
      role,
      status: 'pending',
      employeeId: role !== 'Board' ? employeeRef : null,
      department: role !== 'Board' ? department : null
    };

    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username }).populate('employeeId');
    if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
        department: user.department || null
      },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      user: {
        userId: user._id,
        username: user.username,
        role: user.role,
        department: user.department || null,
        fullName: user.employeeId
          ? `${user.employeeId.firstName} ${user.employeeId.lastName}`
          : null,
        employmentType: user.employeeId?.employmentType || null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
});
//สิ้นสุด login กับ register
/**
 * Update user
 * ใช้ middleware authenticateToken และ authorizeRoles สำหรับ role: IT, HR, Board, Head
 */
router.patch('/update/:id', async (req, res) => {
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
router.get('/inactive', async (req, res) => {
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
router.get('/active', async (req, res) => {
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
