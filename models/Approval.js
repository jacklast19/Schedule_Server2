const mongoose = require('mongoose');

const ApprovalSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  leaveRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Leave' },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule'},
  shiftSwapId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShiftSwap'},
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Approval', ApprovalSchema);
