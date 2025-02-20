const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Attendance = require('../models/Attendance');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const authorizeActiveUser = require('../middleware/authorizeRoles');

router.post('/upload', upload.single('file'), (req, res) => {
    const attendanceMap = new Map(); // ใช้ Map เพื่อเก็บ HIPID และข้อมูลที่เกี่ยวข้อง

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        const hipIdKey = Object.keys(row).find(key => key.trim() === 'HIPID');
        const dateTimeKey = Object.keys(row).find(key => key.trim() === 'วัน/เวลา');

        if (hipIdKey && dateTimeKey) {
          const hipId = row[hipIdKey].trim();
          const dateTime = row[dateTimeKey].trim();
          const [dateString, timeString] = dateTime.split(' ');
          const [day, month, year] = dateString.split('-');
          const formattedDate = new Date(`${year}-${month}-${day}`);

          // ตรวจสอบว่า dateString และ timeString ไม่ใช่ค่า undefined
          if (!dateString || !timeString) {
            console.error('Invalid date or time:', dateString, timeString);
            return; // ข้ามแถวนี้หากข้อมูลไม่ถูกต้อง
          }

          if (!attendanceMap.has(hipId)) {
            attendanceMap.set(hipId, []);
          }

          const records = attendanceMap.get(hipId);

          // เช็คสถานะการเข้าทำงาน
          if (records.length > 0 && records[records.length - 1].date.getTime() === formattedDate.getTime()) {
            const lastRecord = records[records.length - 1];

            // ถ้ามีการบันทึก "in" อยู่แล้ว แต่ไม่มี "out" ให้บันทึก "out"
            if (lastRecord.status === 1 && !lastRecord.out) {
              lastRecord.out = timeString;
              lastRecord.status = 2; // เปลี่ยนสถานะเป็น "out"
            } else if (lastRecord.status === 2) {
              // ถ้ามีการบันทึก "out" แล้ว จะบันทึก "in" ใหม่
              records.push({ date: formattedDate, in: timeString, out: null, status: 1 });
            }
          } else {
            // ถ้ายังไม่มีการบันทึกในวันนั้น สร้างบันทึกใหม่
            records.push({ date: formattedDate, in: timeString, out: null, status: 1 });
          }
        } else {
          console.error('Missing required fields in row:', row);
        }
      })
      .on('end', () => {
        const attendanceRecords = Array.from(attendanceMap.entries()).map(([hipId, records]) => {
          return { hipId, records };
        });

        // ส่งข้อมูลกลับไปที่ frontend
        res.status(200).json({ attendanceRecords });

        // ลบไฟล์หลังจากประมวลผลเสร็จ
        fs.unlinkSync(req.file.path);
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        res.status(500).json({ message: 'Error reading CSV file', error });
      });
});

router.post('/save', async (req, res) => {
    try {
      const attendanceRecords = req.body;
      await Attendance.insertMany(attendanceRecords);
      res.status(200).json({ message: 'Attendance records saved successfully' });
    } catch (error) {
      console.error('Error saving attendance records:', error); // เพิ่ม log ข้อผิดพลาด
      res.status(500).json({ message: 'Error saving attendance records', error });
    }
});

module.exports = router;
