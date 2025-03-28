// ไฟล์ /models/Employee.js สำหรับกำหนดโครงสร้างข้อมูลและการทำงานของข้อมูลพนักงาน
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
  HIPID: { type: String, required: true, unique: true }, // HIPID ใช้เชื่อมกับระบบสแกน
  workStatus: { type: String },        // สถานะการทำงาน (active, resigned, etc.)
  employmentType: {                   // ประเภทพนักงาน
    type: String,
    enum: ['full-time', 'part-time', 'trial-work'],
    default: 'trial-work'
  },
  birthDate: { type: Date },           // วันเดือนปีเกิด
  address: { type: String },          // ที่อยู่
  salary: { type: Number },           // เงินเดือน
  profileImage: { type: String }      // ชื่อไฟล์รูปภาพ
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);