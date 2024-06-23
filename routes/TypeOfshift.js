const express = require('express');
const router = express.Router();
const TypeOfShift = require('../models/typeOfShift');

// Create TypeOfShift
router.post('/', async (req, res) => {
  const { nameOfType, timeIn, timeOut, lateTime, detail } = req.body;

  try {
    const typeOfShift = new TypeOfShift({
      nameOfType,
      timeIn,
      timeOut,
      lateTime,
      detail
    });
    await typeOfShift.save();
    res.status(201).json(typeOfShift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all TypeOfShifts
router.get('/', async (req, res) => {
  try {
    const typeOfShifts = await TypeOfShift.find();
    res.json(typeOfShifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get TypeOfShift by ID
router.get('/:id', async (req, res) => {
  try {
    const typeOfShift = await TypeOfShift.findById(req.params.id);
    if (!typeOfShift) return res.status(404).json({ message: 'TypeOfShift not found' });
    res.json(typeOfShift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update TypeOfShift
router.put('/:id', async (req, res) => {
  const { nameOfType, timeIn, timeOut, lateTime, detail } = req.body;

  try {
    const typeOfShift = await TypeOfShift.findById(req.params.id);
    if (!typeOfShift) return res.status(404).json({ message: 'TypeOfShift not found' });

    typeOfShift.nameOfType = nameOfType || typeOfShift.nameOfType;
    typeOfShift.timeIn = timeIn || typeOfShift.timeIn;
    typeOfShift.timeOut = timeOut || typeOfShift.timeOut;
    typeOfShift.lateTime = lateTime || typeOfShift.lateTime;
    typeOfShift.detail = detail || typeOfShift.detail;

    const updatedTypeOfShift = await typeOfShift.save();
    res.json(updatedTypeOfShift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete TypeOfShift
router.delete('/:id', async (req, res) => {
  try {
    const typeOfShift = await TypeOfShift.findByIdAndDelete(req.params.id);
    if (!typeOfShift) return res.status(404).json({ message: 'TypeOfShift not found' });
    res.json({ message: 'TypeOfShift deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
