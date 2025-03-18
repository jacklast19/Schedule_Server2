const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true }, // รหัสพนักงาน
  firstName: { type: String },         // ชื่อจริงของพนักงาน
  lastName: { type: String },          // นามสกุลของพนักงาน
  position: { type: String },          // ตำแหน่งงาน
  department: { type: String },        // แผนกที่สังกัด
  contactInformation: {              // ข้อมูลติดต่อ
    email: { type: String },           // อีเมล
    phone: { type: String }            // เบอร์โทรศัพท์
  },
  startDate: { type: Date },           // วันที่เริ่มงาน
  endDate: { type: Date },             // วันที่สิ้นสุดการทำงาน (ถ้ามี)
  HIPID: { type: String },             // เพิ่ม HIPID
  workStatus: { type: String },        // สถานะการทำงาน (เปลี่ยนจาก status เป็น workStatus)
  address: { type: String },          // เพิ่ม address
  salary: { type: Number },           // เพิ่ม salary
  profileImage: { type: String },     // เก็บชื่อไฟล์รูปภาพ
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);