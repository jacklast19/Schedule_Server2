const express = require('express');
const router = express.Router();
const ShiftSwap = require('../models/ShiftSwap');
const User = require('../models/user');
const Schedule = require('../models/schedule');

// Create a new shift swap request
router.post('/', async (req, res) => {
  const { requester, requesterDate, requestee, requesteeDate, details } = req.body;

  try {
    // Fetch shift types for requester and requestee
    const requesterShiftType = 'unknown'; // or fetch from Schedule if needed
    const requesteeShiftType = 'unknown'; // or fetch from Schedule if needed

    const approvers = [
      { role: 'User', user: requestee, status: 'pending' },
      { role: 'Head', user: await getHead(requestee), status: 'pending' },
      { role: 'HR', user: await getHR(), status: 'pending' },
      { role: 'Board', user: await getBoard(), status: 'pending' }
    ];

    const shiftSwap = new ShiftSwap({
      requester,
      requesterDate,
      requesterShiftType,
      requestee,
      requesteeDate,
      requesteeShiftType,
      details,
      approvers
    });

    await shiftSwap.save();
    res.status(201).json(shiftSwap);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all shift swap requests
router.get('/', async (req, res) => {
  try {
    const shiftSwaps = await ShiftSwap.find().populate('requester requestee approvers.user');
    res.json(shiftSwaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single shift swap request by ID
router.get('/:id', getShiftSwap, (req, res) => {
  res.json(res.shiftSwap);
});

// Update a shift swap request by ID (approval status)
router.patch('/:id/approve', getShiftSwap, async (req, res) => {
  const { userId, status } = req.body;

  try {
    const approver = res.shiftSwap.approvers.find(approver => approver.user.toString() === userId);
    if (!approver) {
      return res.status(404).json({ message: 'Approver not found' });
    }
    /*if(userId.role ==='Head'){
      getHead;
    }*/
    approver.status = status;
    approver.date = Date.now();

    if (res.shiftSwap.approvers.every(approver => approver.status === 'approved')) {
      res.shiftSwap.status = 'approved';
    } else if (approver.status === 'rejected') {
      res.shiftSwap.status = 'rejected';
    }

    res.shiftSwap.updatedAt = Date.now();
    await res.shiftSwap.save();

    res.json(res.shiftSwap);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a shift swap request by ID
router.delete('/:id', getShiftSwap, async (req, res) => {
  try {
    await res.shiftSwap.remove();
    res.json({ message: 'Deleted shift swap request' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get shift swap by ID
async function getShiftSwap(req, res, next) {
  let shiftSwap;
  try {
    shiftSwap = await ShiftSwap.findById(req.params.id).populate('requester requestee approvers.user');
    if (shiftSwap == null) {
      return res.status(404).json({ message: 'Cannot find shift swap request' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.shiftSwap = shiftSwap;
  next();
}

async function getUser(userId) {
  // Implement logic to get the head of the department for the given userId
  return null; // Return null as default
}
// Additional functions to get approvers
async function getHead(userId) {
  return shiftSwaps.approvers.status = "approved"; // Return null as default
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
