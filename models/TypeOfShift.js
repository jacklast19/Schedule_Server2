const mongoose = require('mongoose');

const TypeOfShiftSchema = new mongoose.Schema({
  nameOfType: { type: String, required: true },
  timeIn: { type: String, required: true },
  timeOut: { type: String, required: true },
  lateTime: { type: Number, required: true },
  detail: { type: String }  // เพิ่มฟิลด์ detail
});


const TypeOfShift = mongoose.model('TypeOfShift', TypeOfShiftSchema);
module.exports = TypeOfShift;
