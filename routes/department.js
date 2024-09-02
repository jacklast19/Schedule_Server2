const express = require('express');
const router = express.Router();
const Department = require('../models/department');
const User = require('../models/department');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');

// Get all departments
router.get('/',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), async (req, res) => {
  try {
    const departments = await Department.find().populate('head');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new department
router.post('/',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), async (req, res) => {
  const { name, head } = req.body;
  const department = new Department({ name, head });

  try {
    const newDepartment = await department.save();
    await updateUserRole(head, 'Head');
    res.status(201).json(newDepartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single department by ID
router.get('/:id',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), getDepartment, (req, res) => {
  res.json(res.department);
});

// Update a department by ID
router.patch('/:id',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), getDepartment, async (req, res) => {
  const { name, head } = req.body;
  if (name != null) res.department.name = name;
  if (head != null) {
    await updateUserRole(res.department.head, 'Employee'); // Revert previous head to Employee role
    res.department.head = head;
    await updateUserRole(head, 'Head'); // Update new head role to Head
  }

  try {
    const updatedDepartment = await res.department.save();
    res.json(updatedDepartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a department by ID
router.delete('/:id',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), getDepartment, async (req, res) => {
  try {
    await updateUserRole(res.department.head, 'Employee'); // Revert head to Employee role
    await res.department.remove();
    res.json({ message: 'Deleted department' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getDepartment(req, res, next) {
  let department;
  try {
    department = await Department.findById(req.params.id).populate('head');
    if (department == null) {
      return res.status(404).json({ message: 'Cannot find department' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.department = department;
  next();
}

async function updateUserRole(userId, role) {
  try {
    const user = await User.findById(userId);
    if (user) {
      user.role = role;
      await user.save();
    }
  } catch (err) {
    throw new Error(`Failed to update user role: ${err.message}`);
  }
}

module.exports = router;
