const mongoose = require('mongoose');

const ShiftSwapSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requesterDate: { type: Date, required: true },
  requesterShiftType: { type: String, default: 'unknown' }, // เปลี่ยนเป็นค่า default
  requestee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requesteeDate: { type: Date, required: true },
  requesteeShiftType: { type: String, default: 'unknown' }, // เปลี่ยนเป็นค่า default
  details: { type: String, required: true },
  approvers: [
    {
      role: { type: String, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // เปลี่ยนเป็นค่า default
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      date: { type: Date }
    }
  ],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ShiftSwap = mongoose.model('ShiftSwap', ShiftSwapSchema);
module.exports = ShiftSwap;
