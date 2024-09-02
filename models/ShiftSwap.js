const mongoose = require('mongoose');

const ShiftSwapSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requesterDate: { type: Date, required: true },
  requesterShiftType: { type: String, default: 'unknown' },
  requestee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requesteeDate: { type: Date, required: true },
  requesteeShiftType: { type: String, default: 'unknown' },
  details: { type: String, required: true },
  approvers: {
    type: new mongoose.Schema({
      head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      hr: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      board: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }, { _id: false })
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ShiftSwap = mongoose.model('ShiftSwap', ShiftSwapSchema);
module.exports = ShiftSwap;
