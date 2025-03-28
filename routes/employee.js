// routes/employee.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// ✅ POST: เพิ่มข้อมูลพนักงานใหม่
router.post('/', async (req, res) => {
  try {
    // ✅ หารหัสล่าสุด
    const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });

    let nextId = 'EMP0001';
    if (lastEmployee && lastEmployee.employeeId) {
      const lastNumber = parseInt(lastEmployee.employeeId.replace('EMP', '')) || 0;
      nextId = 'EMP' + String(lastNumber + 1).padStart(4, '0');
    }

    // ✅ เพิ่มรหัสเข้าไปใน req.body
    const employee = new Employee({
      ...req.body,
      employeeId: nextId
    });

    await employee.save();
    res.status(201).json({ message: 'เพิ่มพนักงานสำเร็จ', employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มพนักงาน' });
  }
});

// ✅ GET: ดึงข้อมูลพนักงานทั้งหมด
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน' });
  }
});

// ✅ GET: ดึงข้อมูลพนักงานตาม ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'ไม่พบพนักงาน' });
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการค้นหา' });
  }
});

// ✅ PUT: แก้ไขข้อมูลพนักงาน
router.put('/:id', async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'ไม่พบพนักงาน' });
    res.json({ message: 'อัปเดตข้อมูลพนักงานสำเร็จ', employee: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดต' });
  }
});

module.exports = router;
