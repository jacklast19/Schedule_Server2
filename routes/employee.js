const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// เรียกใช้งาน Model
const Employee = require('../models/Employee');

// กำหนด config ของ multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // กำหนดให้ไฟล์รูปเก็บในโฟลเดอร์ 'uploads'
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // ตั้งชื่อไฟล์โดยต่อท้าย timestamp เพื่อป้องกันชื่อซ้ำ
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/* ----------------------------------
   1) Create (POST) => /employees
------------------------------------- */
router.post('/', upload.single('profileImage'), async (req, res) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      position,
      department,
      email,
      phone,
      startDate,
      endDate,
      HIPID,
      workStatus, // ใช้ workStatus
      address,
      salary,
    } = req.body;

    // สร้าง object สำหรับบันทึกลง MongoDB
    const newEmployee = new Employee({
      employeeId,
      firstName,
      lastName,
      position,
      department,
      contactInformation: {
        email,
        phone,
      },
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      HIPID,
      workStatus, // ใช้ workStatus
      address,
      salary,
      // ถ้ามีการอัปโหลดไฟล์ จะเก็บชื่อไฟล์ไว้ที่ field profileImage
      profileImage: req.file ? req.file.filename : null,
    });

    await newEmployee.save();
    return res.status(201).json({ message: 'Employee created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

/* ----------------------------------
   2) Read All (GET) => /employees
------------------------------------- */
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    return res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

/* ----------------------------------
   3) Read One (GET) => /employees/:id
------------------------------------- */
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

/* ----------------------------------
   4) Update (PUT) => /employees/:id
------------------------------------- */
router.put('/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      position,
      department,
      email,
      phone,
      startDate,
      endDate,
      HIPID,
      workStatus, // ใช้ workStatus
      address,
      salary,
    } = req.body;

    // ถ้ามีไฟล์ใหม่อัปโหลดเข้ามา จะอัปเดตชื่อไฟล์ลงไปด้วย
    const updateData = {
      employeeId,
      firstName,
      lastName,
      position,
      department,
      contactInformation: {
        email,
        phone,
      },
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      HIPID,
      workStatus, // ใช้ workStatus
      address,
      salary,
    };

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // ให้ return ค่าใหม่หลังอัปเดต
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    return res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

/* ----------------------------------
   5) Delete (DELETE) => /employees/:id
------------------------------------- */
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndRemove(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;