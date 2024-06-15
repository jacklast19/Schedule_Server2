const mongoose = require('mongoose');

const OTSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  hours: { type: Number, required: true },
  reason: { type: String  }
});

module.exports = mongoose.model('OT', OTSchema);
