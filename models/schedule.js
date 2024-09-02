const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  username: String,
  department: String,
  schedule: [
    {
      date: { type: String, required: true },
      shift: { type: String, required: true },
      status: { type: String, enum: ['WT', 'LV', 'SW'], default: 'WT' } // WT: Work Time, LV: Leave, SW: Shift Swap
    }
  ],
  CreateUser: String,
  approvers: [
    {
      role: { type: String, enum: ['Head', 'HR', 'Board'], required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      date: { type: Date }
    }
  ],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
