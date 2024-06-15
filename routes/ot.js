const express = require('express');
const router = express.Router();
const OT = require('../models/ot');

// Get all OT records
router.get('/', async (req, res) => {
  try {
    const otRecords = await OT.find().populate('userId');
    res.json(otRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new OT record
router.post('/', async (req, res) => {
  const { userId, date, startTime, endTime, hours, reason } = req.body;
  const otRecord = new OT({ userId, date, startTime, endTime, hours, reason });

  try {
    const newOTRecord = await otRecord.save();
    res.status(201).json(newOTRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single OT record by ID
router.get('/:id', getOTRecord, (req, res) => {
  res.json(res.otRecord);
});

// Update an OT record by ID
router.patch('/:id', getOTRecord, async (req, res) => {
  const { userId, date, startTime, endTime, hours, reason } = req.body;
  if (userId != null) res.otRecord.userId = userId;
  if (date != null) res.otRecord.date = date;
  if (startTime != null) res.otRecord.startTime = startTime;
  if (endTime != null) res.otRecord.endTime = endTime;
  if (hours != null) res.otRecord.hours = hours;
  if (reason != null) res.otRecord.reason = reason;

  try {
    const updatedOTRecord = await res.otRecord.save();
    res.json(updatedOTRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an OT record by ID
router.delete('/:id', getOTRecord, async (req, res) => {
  try {
    await res.otRecord.remove();
    res.json({ message: 'Deleted OT record' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getOTRecord(req, res, next) {
  let otRecord;
  try {
    otRecord = await OT.findById(req.params.id);
    if (otRecord == null) {
      return res.status(404).json({ message: 'Cannot find OT record' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.otRecord = otRecord;
  next();
}

module.exports = router;
