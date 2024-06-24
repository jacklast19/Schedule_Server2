const express = require('express');
const router = express.Router();
const ShiftSwap = require('../models/ShiftSwap');
const User = require('../models/user');

// Create a new shift swap request
router.post('/', async (req, res) => {
  const { requester, requesterDate, requestee, requesteeDate, details } = req.body;

  try {
    // ค้นหาผู้ใช้
    const requesterUser = await User.findById(requester);
    const requesteeUser = await User.findById(requestee);

    if (!requesterUser || !requesteeUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const approvers = [
      { role: 'User', user: requestee, status: 'pending' },
      { role: 'Head', user: await getHead(requestee), status: 'pending' },
      { role: 'HR', user: await getHR(), status: 'pending' },
      { role: 'Board', user: await getBoard(), status: 'pending' }
    ];

    const shiftSwap = new ShiftSwap({
      requester,
      requesterDate,
      requesterShiftType: 'unknown', // กำหนดค่า placeholder
      requestee,
      requesteeDate,
      requesteeShiftType: 'unknown', // กำหนดค่า placeholder
      details,
      approvers
    });

    await shiftSwap.save();
    res.status(201).json(shiftSwap);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getHead(userId) {
  // Implement logic to get the head of the department for the given userId
  return null; // Return null as default
}

async function getHR() {
  // Implement logic to get the HR approver
  return null; // Return null as default
}

async function getBoard() {
  // Implement logic to get the Board approver
  return null; // Return null as default
}

module.exports = router;
