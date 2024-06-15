const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  type: { type: String, enum: ['sick', 'vacation', 'personal', 'other'], required: true },
  medicalCertificate: { type: Boolean, default: false }, // ใบรับรองแพทย์
  attachment: { type: String }, // ไฟล์แนบ
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

LeaveSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Leave', LeaveSchema);
