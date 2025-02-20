const express = require('express');
const router = express.Router();
const Employee = require('../models/employee'); // Import the Employee model

// Create multiple employees
router.post('/', async (req, res) => {
    try {
        const employees = req.body;
        const result = await Employee.insertMany(employees);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get an employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an employee by ID
router.put('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an employee by ID
router.delete('/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
