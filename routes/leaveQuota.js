const express = require('express');
const router = express.Router();
const LeaveQuota = require('../models/LeaveQuota');
const Employee = require('../models/Employee');

// ✅ ดึง leave quota ทั้งหมดตามปี
router.get('/', async (req, res) => {
  try {
    const year = parseInt(req.query.year);
    if (!year) return res.status(400).json({ message: 'กรุณาระบุปี (year)' });

    const quotas = await LeaveQuota.find({ year }).populate('employee', 'firstName lastName employeeId department');
    res.json(quotas);
  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err);
    res.status(500).json({ message: 'ไม่สามารถโหลดข้อมูลวันลาได้' });
  }
});

// ✅ เพิ่ม leave quota ทีละหลายคน (ครั้งเดียวต่อปี)
router.post('/bulk', async (req, res) => {
  try {
    const { employeeIds, year, quotas } = req.body;
    if (!employeeIds || !year || !quotas) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' });
    }

    const inserted = [];

    for (const empId of employeeIds) {
      const exists = await LeaveQuota.findOne({ employee: empId, year });
      if (exists) continue; // ข้ามหากมีอยู่แล้ว
      const formatQuota = (val) => ({
        totalDays: Number(val) || 0,
        usedHours: 0
      });
      const newQuota = new LeaveQuota({
        employee: empId,
        year,
        quotas: {
          sick: formatQuota(quotas.sick),
          personal: formatQuota(quotas.personal),
          vacation: formatQuota(quotas.vacation),
          ordination: formatQuota(quotas.ordination),
          maternity: formatQuota(quotas.maternity),
          other: formatQuota(quotas.other)
        }
      });

      await newQuota.save();
      inserted.push(newQuota);
    }

    res.status(201).json({ message: 'บันทึกโควต้าเรียบร้อย', insertedCount: inserted.length });
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการบันทึก:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มโควต้าพนักงาน' });
  }
});

module.exports = router;
