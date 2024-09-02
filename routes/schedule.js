const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const jwt = require('jsonwebtoken'); // สมมติว่าคุณใช้ JWT สำหรับการตรวจสอบสิทธิ์
const auth = require('../routes/auth');
// Middleware สำหรับการตรวจสอบสิทธิ์
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const jwtSecret = 'schedule_jwt_secret';
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Middleware สำหรับการตรวจสอบบทบาท
function checkRole(req, res, next) {
  const userRole = req.user.role; // สมมติว่ามีการจัดการตรวจสอบสิทธิ์และผู้ใช้ที่เข้าสู่ระบบมีฟิลด์ role
  if (userRole !== 'HR' && userRole !== 'Head' && userRole !== 'Board') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}

// Get all schedules
router.get('/', authenticateToken, async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new schedule
router.post('/', authenticateToken, async (req, res) => {
  const schedule = new Schedule({
    username: req.body.username,
    department: req.body.department,
    schedule: req.body.schedule,
    CreateUser: req.body.CreateUser,
    approvers: req.body.approvers,
    status: req.body.status
  });

  try {
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single schedule by username
router.get('/:username', authenticateToken, getScheduleByUsername, (req, res) => {
  res.json(res.schedule);
});

// Update a schedule by username
router.patch('/:username', authenticateToken, getScheduleByUsername, async (req, res) => {
  if (req.body.username != null) {
    res.schedule.username = req.body.username;
  }
  if (req.body.department != null) {
    res.schedule.department = req.body.department;
  }
  if (req.body.schedule != null) {
    res.schedule.schedule = req.body.schedule;
  }
  if (req.body.CreateUser != null) {
    res.schedule.CreateUser = req.body.CreateUser;
  }
  if (req.body.approvers != null) {
    res.schedule.approvers = req.body.approvers;
  }
  if (req.body.status != null) {
    res.schedule.status = req.body.status;
  }
  try {
    const updatedSchedule = await res.schedule.save();
    res.json(updatedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.patch('/approve/:id', authenticateToken, checkRole, async (req, res) => {
  const scheduleId = req.params.id; // รับ ObjectId จาก URL
  const role = req.body.role;
  const approverId = req.body.userId;

  try {
    // ค้นหา schedule โดยใช้ ObjectId
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // ค้นหา approver ในรายการ approvers
    const approver = schedule.approvers.find(ap => ap.role === role);
    if (!approver) {
      return res.status(400).json({ message: 'Invalid role for approval' });
    }

    // อัพเดตสถานะการอนุมัติ
    approver.status = 'approved';
    approver.user = approverId;
    approver.date = new Date();

    // ตรวจสอบว่าทุก approvers ได้อนุมัติแล้วหรือยัง
    const allApproved = schedule.approvers.every(ap => ap.status === 'approved');
    if (allApproved) {
      schedule.status = 'approved';
    }

    const updatedSchedule = await schedule.save();
    res.json(updatedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Approve a schedule by role
router.patch('/approve/:username', authenticateToken, checkRole, getScheduleByUsername, async (req, res) => {
  const role = req.body.role;
  const approverId = req.body.userId;

  const approver = res.schedule.approvers.find(ap => ap.role === role);
  if (!approver) {
    return res.status(400).json({ message: 'Invalid role for approval' });
  }

  approver.status = 'approved';
  approver.user = approverId;
  approver.date = new Date();

  // ตรวจสอบว่าทุก approvers ได้อนุมัติแล้วหรือยัง
  const allApproved = res.schedule.approvers.every(ap => ap.status === 'approved');
  if (allApproved) {
    res.schedule.status = 'approved';
  }

  try {
    const updatedSchedule = await res.schedule.save();
    res.json(updatedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a schedule by username
router.delete('/:username', authenticateToken, getScheduleByUsername, async (req, res) => {
  try {
    await res.schedule.remove();
    res.json({ message: 'Deleted Schedule' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getScheduleByUsername(req, res, next) {
  let schedule;
  try {
    schedule = await Schedule.findOne({ username: req.params.username });
    if (schedule == null) {
      return res.status(404).json({ message: 'Cannot find schedule' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.schedule = schedule;
  next();
}

module.exports = router;
