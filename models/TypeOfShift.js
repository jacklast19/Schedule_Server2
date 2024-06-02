const mongoose = require('mongoose');

const TypeOfShiftSchema = new mongoose.Schema({
  NameOfType: { type: String, required: true },
  TimeIn: { type: String, required: true },
  TimeOut: { type: String, required: true },
  LateTime: { type: Number, required: true }
});

module.exports = mongoose.model('TypeOfShift', TypeOfShiftSchema);
