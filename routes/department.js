const express = require('express');
const router = express.Router();
const Department = require('../models/department');

// ✅ CREATE แผนกใหม่
router.post('/', async (req, res) => {
  try {
    console.log('📥 ข้อมูลที่รับมา:', req.body);

    const { name, shortName, head } = req.body;

    const department = new Department({ name, shortName, head });
    await department.save();

    res.status(201).json(department);
  } catch (err) {
    console.error('❌ ERROR ขณะบันทึกแผนก:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มแผนก' });
  }
});

// ✅ READ ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find(); // ❌ remove populate
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแผนก' });
  }
});

// ✅ READ รายตัว
router.get('/:id', async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id); // ❌ remove populate
    if (!dept) return res.status(404).json({ message: 'ไม่พบแผนก' });
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแผนก' });
  }
});

// ✅ UPDATE แผนก
router.put('/:id', async (req, res) => {
  try {
    const { name, shortName, head } = req.body;

    // ❌ remove head validation with User
    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { name, shortName, head },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'ไม่พบแผนก' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตแผนก' });
  }
});

// ✅ DELETE แผนก
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'ไม่พบแผนก' });

    res.json({ message: 'ลบแผนกเรียบร้อย' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบแผนก' });
  }
});

module.exports = router;
