const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },      // ชื่อผู้ใช้สำหรับเข้าสู่ระบบ
  password: { type: String, required: true },                    // รหัสผ่าน (จะเข้ารหัสใน pre-save)
  role: { 
    type: String, 
    enum: ['IT', 'HR', 'Board', 'Head', 'Employee'], 
    required: true 
  },                                                             // สิทธิ์การใช้งานในระบบ
  department: { type: String },                                  // แผนกที่สังกัด (optional)
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'inactive' 
  },                                                             // สถานะของผู้ใช้งาน (เช่น เปิดใช้งาน/ปิดใช้งาน)
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },  // อ้างอิง ObjectId ของ Employee
  createdAt: { type: Date, default: Date.now },                  // วันที่สร้างบัญชีผู้ใช้
  updatedAt: { type: Date, default: Date.now }                   // วันที่แก้ไขบัญชีผู้ใช้ล่าสุด
}, { collection: 'user' });

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = Date.now();
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
