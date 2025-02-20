const express = require('express');
const router = express.Router();
const DetailOfMonth = require('../models/DetailOfMonth'); // นำเข้าโมเดล
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const authorizeActiveUser = require('../middleware/authorizeRoles');
// Get all details of months
router.get('/', async (req, res) => {
  try {
    const detailsOfMonths = await DetailOfMonth.find();
    res.json(detailsOfMonths);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new detail of month
router.post('/', async (req, res) => {
  const detailOfMonth = new DetailOfMonth({
    Month: req.body.Month,
    Department: req.body.Department,
    NumOfMonth: req.body.NumOfMonth,
    Status: req.body.Status
  });

  try {
    const newDetailOfMonth = await detailOfMonth.save();
    res.status(201).json(newDetailOfMonth);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single detail of month by ID
router.get('/:id', getDetailOfMonth, (req, res) => {
  res.json(res.detailOfMonth);
});

// Update a detail of month by ID
router.patch('/:id', getDetailOfMonth, async (req, res) => {
  if (req.body.Month != null) {
    res.detailOfMonth.Month = req.body.Month;
  }
  if (req.body.Department != null) {
    res.detailOfMonth.Department = req.body.Department;
  }
  if (req.body.NumOfMonth != null) {
    res.detailOfMonth.NumOfMonth = req.body.NumOfMonth;
  }
  if (req.body.Status != null) {
    res.detailOfMonth.Status = req.body.Status;
  }
  try {
    const updatedDetailOfMonth = await res.detailOfMonth.save();
    res.json(updatedDetailOfMonth);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a detail of month by ID
router.delete('/:id', getDetailOfMonth, async (req, res) => {
  try {
    await res.detailOfMonth.remove();
    res.json({ message: 'Deleted DetailOfMonth' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getDetailOfMonth(req, res, next) {
  let detailOfMonth;
  try {
    detailOfMonth = await DetailOfMonth.findById(req.params.id);
    if (detailOfMonth == null) {
      return res.status(404).json({ message: 'Cannot find detail of month' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.detailOfMonth = detailOfMonth;
  next();
}

module.exports = router;
