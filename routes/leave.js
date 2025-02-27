// routes/leave.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Leave = require('../models/leaveRequest');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const authorizeActiveUser = require('../middleware/authorizeRoles');
const User = require("../models/user")

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Get all leave records
router.get('/', async (req, res) => {
  try {
    const leaveRecords = await Leave.find().populate('userId');
    res.json(leaveRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new leave record
router.post('/', upload.fields([{ name: 'medicalCertificate', maxCount: 1 }, { name: 'attachments', maxCount: 10 }]), async (req, res) => {
  const { startDate, endDate, reason, leaveType, details } = req.body;
    const user = await User.findOne({ username: req.body.userId });
      if (!user) {
          return res.status(401).json({ message: 'Invalid user' });
      }
      const userId = user._id;
  const medicalCertificate = req.files && req.files['medicalCertificate'] ? req.files['medicalCertificate'][0].path : null;
  const attachments = req.files && req.files['attachments'] ? req.files['attachments'].map(file => file.path) : [];

  const leaveRecord = new Leave({ userId, startDate, endDate, reason, leaveType, details, medicalCertificate, attachments });

  try {
    const newLeaveRecord = await leaveRecord.save();
    res.status(201).json(newLeaveRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single leave record by ID
router.get('/:id', getLeaveRecord, (req, res) => {
  res.json(res.leaveRecord);
});

// Update a leave record by ID
router.patch('/:id', upload.fields([{ name: 'medicalCertificate', maxCount: 1 }, { name: 'attachments', maxCount: 10 }]), async (req, res) => {
  const { userId, startDate, endDate, reason, status, leaveType, details } = req.body;
  const approver = {
    head: req.body.approver?.head || res.leaveRecord.approver.head,
    hr: req.body.approver?.hr || res.leaveRecord.approver.hr,
    board: req.body.approver?.board || res.leaveRecord.approver.board
  };
  const medicalCertificate = req.files && req.files['medicalCertificate'] ? req.files['medicalCertificate'][0].path : null;
  const attachments = req.files && req.files['attachments'] ? req.files['attachments'].map(file => file.path) : [];

  if (userId != null) res.leaveRecord.userId = userId;
  if (startDate != null) res.leaveRecord.startDate = startDate;
  if (endDate != null) res.leaveRecord.endDate = endDate;
  if (reason != null) res.leaveRecord.reason = reason;
  if (status != null) res.leaveRecord.status = status;
  if (leaveType != null) res.leaveRecord.leaveType = leaveType;
  if (details != null) res.leaveRecord.details = details;
  if (medicalCertificate != null) res.leaveRecord.medicalCertificate = medicalCertificate;
  if (attachments.length > 0) res.leaveRecord.attachments = attachments;

  res.leaveRecord.approver = approver;
  res.leaveRecord.updatedAt = Date.now();

  try {
    const updatedLeaveRecord = await res.leaveRecord.save();
    res.json(updatedLeaveRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Approve leave record by Head
router.patch('/:id/approve/head', async (req, res) => {
  try {
    const leaveRecord = await Leave.findById(req.params.id);
    if (!leaveRecord) {
      return res.status(404).json({ message: 'Leave record not found' });
    }

    leaveRecord.approver.head = req.body.approverId;

    if (leaveRecord.approver.head && leaveRecord.approver.hr && leaveRecord.approver.board) {
      leaveRecord.status = 'approved';
    }

    leaveRecord.updatedAt = Date.now();
    const updatedLeaveRecord = await leaveRecord.save();
    res.json(updatedLeaveRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Approve leave record by HR
router.patch('/:id/approve/hr', async (req, res) => {
  try {
    const leaveRecord = await Leave.findById(req.params.id);
    if (!leaveRecord) {
      return res.status(404).json({ message: 'Leave record not found' });
    }

    leaveRecord.approver.hr = req.body.approverId;

    if (leaveRecord.approver.head && leaveRecord.approver.hr && leaveRecord.approver.board) {
      leaveRecord.status = 'approved';
    }

    leaveRecord.updatedAt = Date.now();
    const updatedLeaveRecord = await leaveRecord.save();
    res.json(updatedLeaveRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Approve leave record by Board
router.patch('/:id/approve/board', async (req, res) => {
  try {
    const leaveRecord = await Leave.findById(req.params.id);
    if (!leaveRecord) {
      return res.status(404).json({ message: 'Leave record not found' });
    }

    leaveRecord.approver.board = req.body.approverId;

    if (leaveRecord.approver.head && leaveRecord.approver.hr && leaveRecord.approver.board) {
      leaveRecord.status = 'approved';
    }

    leaveRecord.updatedAt = Date.now();
    const updatedLeaveRecord = await leaveRecord.save();
    res.json(updatedLeaveRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a leave record by ID
router.delete('/:id', getLeaveRecord, async (req, res) => {
  try {
    await res.leaveRecord.remove();
    res.json({ message: 'Deleted leave record' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getLeaveRecord(req, res, next) {
  let leaveRecord;
  try {
    leaveRecord = await Leave.findById(req.params.id).populate('userId');
    if (leaveRecord == null) {
      return res.status(404).json({ message: 'Cannot find leave record' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.leaveRecord = leaveRecord;
  next();
}

module.exports = router;
