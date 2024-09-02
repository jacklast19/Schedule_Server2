const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  hipId: { type: String, required: true },
  records: [{
    date: { type: Date, required: true },
    in: { type: String, required: true },
    out: { type: String }
  }]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
