const mongoose = require('mongoose');

const DetailOfMonthSchema = new mongoose.Schema({
  Month: { type: String, required: true },
  Department: { type: String, required: true },
  NumOfMonth: { type: Number, required: true },
  Status: { type: String, required: true }
});

module.exports = mongoose.model('DetailOfMonth', DetailOfMonthSchema);
