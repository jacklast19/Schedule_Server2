const express = require('express');
const router = express.Router();
const LeaveBalance = require('../models/leaveBalance');
const User = require('../models/user');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const authorizeActiveUser = require('../middleware/authorizeRoles');
// Convert Buddhist year to Gregorian year if necessary
function convertYear(year) {
  if (year >= 2400) { // Assuming any year above 2400 is in Buddhist calendar
    return year - 543;
  }
  return year;
}

// Create or update leave balance for a user
router.post('/', async (req, res) => {
  const { userId, year, sickLeave, personalLeave, vacationLeave } = req.body;
  const convertedYear = convertYear(year);

  try {
    let leaveBalance = await LeaveBalance.findOne({ userId, year: convertedYear });
    if (leaveBalance) {
      // Update existing leave balance
      leaveBalance.sickLeave = sickLeave;
      leaveBalance.personalLeave = personalLeave;
      leaveBalance.vacationLeave = vacationLeave;
    } else {
      // Create new leave balance
      leaveBalance = new LeaveBalance({ userId, year: convertedYear, sickLeave, personalLeave, vacationLeave });
    }
    const savedLeaveBalance = await leaveBalance.save();
    res.status(201).json(savedLeaveBalance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get leave balance for a user for a specific year
router.get('/user/:userId/year/:year', async (req, res) => {
  const { userId, year } = req.params;
  const convertedYear = convertYear(year);

  try {
    const leaveBalance = await LeaveBalance.findOne({ userId, year: convertedYear }).populate('userId', 'username firstName lastName department role');
    if (!leaveBalance) {
      return res.status(404).json({ message: 'Leave balance not found' });
    }
    res.json(leaveBalance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all leave balances
router.get('/', async (req, res) => {
  try {
    const leaveBalances = await LeaveBalance.find().populate('userId', 'username firstName lastName department role');
    res.json(leaveBalances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
