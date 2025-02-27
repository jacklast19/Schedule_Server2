// my-backend/models/LeaveRequest.js
const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    leaveType: String,
    startDate: String,
    endDate: String,
    details: String,
    imageUrl: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    medicalCertificate: {
      type: String, // Assuming you store the path to the file
      required: false // Or true, if it's always required
    },
    attachments: [{
      type: String, // Array of file paths
    }]
    // ... other fields
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
module.exports = LeaveRequest;
