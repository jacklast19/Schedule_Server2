// models/LeaveQuota.js
const mongoose = require('mongoose');

const leaveQuotaSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    unique: false
  },
  year: { type: Number, required: true },
  quotas: {
    sick:         { totalDays: Number, usedHours: { type: Number, default: 0 } },
    personal:     { totalDays: Number, usedHours: { type: Number, default: 0 } },
    vacation:     { totalDays: Number, usedHours: { type: Number, default: 0 } },
    ordination:   { totalDays: Number, usedHours: { type: Number, default: 0 } },
    maternity:    { totalDays: Number, usedHours: { type: Number, default: 0 } },
    other:        { totalDays: Number, usedHours: { type: Number, default: 0 } }
  }
}, { timestamps: true });

leaveQuotaSchema.index({ employee: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('LeaveQuota', leaveQuotaSchema);
