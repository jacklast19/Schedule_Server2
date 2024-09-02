const express = require('express');
const router = express.Router();
const ShiftSwap = require('../models/ShiftSwap');
const User = require('../models/user');
const Schedule = require('../models/schedule');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');

// Create a new shift swap request
router.post('/', async (req, res) => {
  const { requester, requesterDate, requestee, requesteeDate, details } = req.body;

  try {
    const requesterShiftType = 'unknown';
    const requesteeShiftType = 'unknown';

    const approvers = {
      head: await getHead(requestee),
      hr: await getHR(),
      board: await getBoard()
    };

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
    const shiftSwaps = await ShiftSwap.find().populate('requester requestee approvers.head approvers.hr approvers.board');
    res.json(shiftSwaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single shift swap request by ID
router.get('/:id', getShiftSwap, (req, res) => {
  res.json(res.shiftSwap);
});

// Approve shift swap request by Requestee (User)
router.patch('/:id/approve/requestee', async (req, res) => {
  try {
    const shiftSwap = await ShiftSwap.findById(req.params.id);
    if (!shiftSwap) {
      return res.status(404).json({ message: 'Shift swap request not found' });
    }

    if (shiftSwap.requestee.toString() !== req.body.approverId) {
      return res.status(403).json({ message: 'You are not authorized to approve this request' });
    }

    shiftSwap.approvers.head = req.body.approverId;

    shiftSwap.updatedAt = Date.now();
    const updatedShiftSwap = await shiftSwap.save();
    res.json(updatedShiftSwap);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Approve shift swap request by Head
router.patch('/:id/approve/head', async (req, res) => {
  try {
    const shiftSwap = await ShiftSwap.findById(req.params.id);
    if (!shiftSwap) {
      return res.status(404).json({ message: 'Shift swap request not found' });
    }

    shiftSwap.approvers.head = req.body.approverId;

    if (shiftSwap.approvers.head && shiftSwap.approvers.hr && shiftSwap.approvers.board) {
      shiftSwap.status = 'approved';
    }

    shiftSwap.updatedAt = Date.now();
    const updatedShiftSwap = await shiftSwap.save();
    res.json(updatedShiftSwap);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Approve shift swap request by HR
router.patch('/:id/approve/hr', async (req, res) => {
  try {
    const shiftSwap = await ShiftSwap.findById(req.params.id);
    if (!shiftSwap) {
      return res.status(404).json({ message: 'Shift swap request not found' });
    }

    shiftSwap.approvers.hr = req.body.approverId;

    if (shiftSwap.approvers.head && shiftSwap.approvers.hr && shiftSwap.approvers.board) {
      shiftSwap.status = 'approved';
    }

    shiftSwap.updatedAt = Date.now();
    const updatedShiftSwap = await shiftSwap.save();
    res.json(updatedShiftSwap);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Approve shift swap request by Board
router.patch('/:id/approve/board', async (req, res) => {
  try {
    const shiftSwap = await ShiftSwap.findById(req.params.id);
    if (!shiftSwap) {
      return res.status(404).json({ message: 'Shift swap request not found' });
    }

    shiftSwap.approvers.board = req.body.approverId;

    if (shiftSwap.approvers.head && shiftSwap.approvers.hr && shiftSwap.approvers.board) {
      shiftSwap.status = 'approved';
    }

    shiftSwap.updatedAt = Date.now();
    const updatedShiftSwap = await shiftSwap.save();
    res.json(updatedShiftSwap);
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
    shiftSwap = await ShiftSwap.findById(req.params.id).populate('requester requestee approvers.head approvers.hr approvers.board');
    if (shiftSwap == null) {
      return res.status(404).json({ message: 'Cannot find shift swap request' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.shiftSwap = shiftSwap;
  next();
}

// Additional functions to get approvers
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
