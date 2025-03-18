const mongoose = require('mongoose');

   const shiftSchema = new mongoose.Schema({
     nameShrift: {
       type: String,
       required: true,
     },
     monday: {
       beforeOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
       shift: {
         startTime: String,
         endTime: String,
       },
       afterOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
     },
     tuesday: {
       beforeOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
       shift: {
         startTime: String,
         endTime: String,
       },
       afterOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
     },
     wednesday: {
       beforeOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
       shift: {
         startTime: String,
         endTime: String,
       },
       afterOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
     },
     thursday: {
       beforeOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
       shift: {
         startTime: String,
         endTime: String,
       },
       afterOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
     },
     friday: {
       beforeOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
       shift: {
         startTime: String,
         endTime: String,
       },
       afterOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
     },
     saturday: {
       beforeOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
       shift: {
         startTime: String,
         endTime: String,
       },
       afterOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
     },
     sunday: {
       beforeOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
       shift: {
         startTime: String,
         endTime: String,
       },
       afterOvertime: {
         startTime: String,
         endTime: String,
         calculateType: {
           type: String,
           enum: ['fixed', 'scan'],
         },
       },
     },
   });

   module.exports = mongoose.model('Shift', shiftSchema);