const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // หัวหน้าแผนก
});

module.exports = mongoose.model('Department', DepartmentSchema);
