const express = require('express');
const router = express.Router();
const TypeOfShift = require('../models/TypeOfShift');

// Get all types of shifts
router.get('/', async (req, res) => {
  try {
    const typesOfShifts = await TypeOfShift.find();
    res.json(typesOfShifts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new type of shift
router.post('/', async (req, res) => {
  const typeOfShift = new TypeOfShift({
    NameOfType: req.body.NameOfType,
    TimeIn: req.body.TimeIn,
    TimeOut: req.body.TimeOut,
    LateTime: req.body.LateTime
  });

  try {
    const newTypeOfShift = await typeOfShift.save();
    res.status(201).json(newTypeOfShift);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single type of shift by ID
router.get('/:id', getTypeOfShift, (req, res) => {
  res.json(res.typeOfShift);
});

// Update a type of shift by ID
router.patch('/:id', getTypeOfShift, async (req, res) => {
  if (req.body.NameOfType != null) {
    res.typeOfShift.NameOfType = req.body.NameOfType;
  }
  if (req.body.TimeIn != null) {
    res.typeOfShift.TimeIn = req.body.TimeIn;
  }
  if (req.body.TimeOut != null) {
    res.typeOfShift.TimeOut = req.body.TimeOut;
  }
  if (req.body.LateTime != null) {
    res.typeOfShift.LateTime = req.body.LateTime;
  }
  try {
    const updatedTypeOfShift = await res.typeOfShift.save();
    res.json(updatedTypeOfShift);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a type of shift by ID
router.delete('/:id', getTypeOfShift, async (req, res) => {
  try {
    await res.typeOfShift.remove();
    res.json({ message: 'Deleted TypeOfShift' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getTypeOfShift(req, res, next) {
  let typeOfShift;
  try {
    typeOfShift = await TypeOfShift.findById(req.params.id);
    if (typeOfShift == null) {
      return res.status(404).json({ message: 'Cannot find type of shift' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.typeOfShift = typeOfShift;
  next();
}

module.exports = router;
