const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new schedule
router.post('/', async (req, res) => {
  const schedule = new Schedule({
    username: req.body.username,
    department: req.body.department,
    schedule: req.body.schedule
    });

  try {
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single schedule by username
router.get('/:username', getScheduleByUsername, (req, res) => {
  res.json(res.schedule);
});

// Update a schedule by username
router.patch('/:username', getScheduleByUsername, async (req, res) => {
  if (req.body.username != null) {
    res.schedule.username = req.body.username;
  }
  if (req.body.department != null) {
    res.schedule.department = req.body.department;
  }
  if (req.body.schedule != null) {
    res.schedule.schedule = req.body.schedule;
  }
  try {
    const updatedSchedule = await res.schedule.save();
    res.json(updatedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a schedule by username
router.delete('/:username', getScheduleByUsername, async (req, res) => {
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
