const express = require('express');
const router = express.Router();
const Leave = require('../models/leave');

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
router.post('/', async (req, res) => {
  const { userId, startDate, endDate, reason, status, type, medicalCertificate, attachment } = req.body;
  const leaveRecord = new Leave({ userId, startDate, endDate, reason, status, type, medicalCertificate, attachment });

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
router.patch('/:id', getLeaveRecord, async (req, res) => {
  const { userId, startDate, endDate, reason, status, type, medicalCertificate, attachment } = req.body;
  if (userId != null) res.leaveRecord.userId = userId;
  if (startDate != null) res.leaveRecord.startDate = startDate;
  if (endDate != null) res.leaveRecord.endDate = endDate;
  if (reason != null) res.leaveRecord.reason = reason;
  if (status != null) res.leaveRecord.status = status;
  if (type != null) res.leaveRecord.type = type;
  if (medicalCertificate != null) res.leaveRecord.medicalCertificate = medicalCertificate;
  if (attachment != null) res.leaveRecord.attachment = attachment;

  try {
    const updatedLeaveRecord = await res.leaveRecord.save();
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
