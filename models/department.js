const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  shortName: { type: String, required: true },
  name: { type: String, required: true },
  head: { type: String } // เป็นชื่อหัวหน้าแผนกแบบ text
});

module.exports = mongoose.model('Department', departmentSchema);
