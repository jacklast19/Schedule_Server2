const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaveType: { type: String, required: true }, // เช่น ลาป่วย, ลากิจ
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvals: [{
    role: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    date: { type: Date }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  medicalCertificate: { type: String }, // ใบรับรองแพทย์ ถ้ามี
  attachments: [{ type: String }], // ไฟล์แนบ ถ้ามี
  department: { type: String, required: true } // แผนก
});

const Leave = mongoose.model('Leave', LeaveSchema);
module.exports = Leave;
