const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  role: { type: String, required: true, enum: ['IT', 'HR', 'Board', 'Head', 'Employee'] }
});

module.exports = mongoose.model('Role', RoleSchema);
