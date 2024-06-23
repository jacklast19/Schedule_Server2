const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  detail: { type: String, required: true },
  file: { type: String, required: true }, // path to the uploaded file
  approvers: [
    {
      role: { type: String, required: true },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    }
  ],
  submittedDate: { type: Date, default: Date.now },
  department: { type: String, required: true }
});

const Document = mongoose.model('Document', DocumentSchema);
module.exports = Document;
