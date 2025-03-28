// ไฟล์ /app.js ใช้สำหรับเริ่มต้น server และเชื่อมต่อ MongoDB
// โดยใช้ Express.js และ Mongoose  
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();


app.use(bodyParser.json());


const corsOptions = {
  origin: ['http://localhost:8100', 'http://localhost:8081'],
  credentials: true,
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(function(req, res, next) {
  const allowedOrigins = ['http://localhost:8100', 'http://localhost:8081'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// เรียกใช้งานไฟล์ router ที่มีอยู่
const scheduleRouter = require('./routes/schedule');
const typeOfShiftRouter = require('./routes/TypeOfshift');
const detailOfMonthRouter = require('./routes/detailOfMonth');
const departmentRouter = require('./routes/department');
const roleRouter = require('./routes/role');
const userRouter = require('./routes/user');
//const authRouter = require('./routes/auth');
const otRouter = require('./routes/ot');
const leaveRouter = require('./routes/leave');
const documentRouter = require('./routes/document');
const shiftSwapRouter = require('./routes/shiftSwap');
const leaveBalanceRouter = require('./routes/leaveBalance');
const attendanceRouter = require('./routes/attendance'); 
const employeeRouter = require('./routes/employee'); // <--- เพิ่ม employeeRouter
const shiftRouter = require('./routes/shift');
// Static path สำหรับไฟล์ที่อัปโหลด (รูปภาพ)
app.use('/uploads', express.static('uploads'));

// กำหนดเส้นทาง
app.use('/schedules', scheduleRouter);
app.use('/typesOfShifts', typeOfShiftRouter);
app.use('/detailsOfMonths', detailOfMonthRouter);
app.use('/departments', departmentRouter);
app.use('/roles', roleRouter);
app.use('/users', userRouter);
//app.use('/auth', authRouter);
app.use('/ot', otRouter);
app.use('/leaves', leaveRouter);
app.use('/documents', documentRouter);
app.use('/shiftSwaps', shiftSwapRouter);
app.use('/leaveBalances', leaveBalanceRouter);
app.use('/hip-attendances', attendanceRouter);
app.use('/employees', employeeRouter); // <--- เพิ่ม employeeRouter
app.use('/shifts', shiftRouter);

// เริ่มต้น server
const port = process.env.port || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
