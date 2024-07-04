const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  username: String,
  department: String,
  schedule: [
    {
      date: String,
      shift: String,
      
    }],
  CreateUser: String
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
