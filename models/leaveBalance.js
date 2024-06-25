const mongoose = require('mongoose');

const LeaveBalanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, required: true },
  sickLeave: { type: Number, required: true },
  personalLeave: { type: Number, required: true },
  vacationLeave: { type: Number, required: true }
});

const LeaveBalance = mongoose.model('LeaveBalance', LeaveBalanceSchema);
module.exports = LeaveBalance;
