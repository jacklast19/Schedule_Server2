const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeCode: String,
    firstName: String,
    lastName: String,
    department: String,
    hipId: Number, 
    startDate: Date,
    endDate: Date,
    dateOfBirth: Date,
    salary: Number,
    phoneNumber: String,
    idNumber: String,
    taxNumber: String,
    workStatus: String,
    workType: String
});

module.exports = mongoose.model('Employee', employeeSchema);
