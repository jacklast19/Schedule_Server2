const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// CORS middleware configuration
const corsOptions = {
  origin: 'http://localhost:8100',  // Allow requests from this origin
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200 // Allow sending cookies and authentication headers
};

app.use(cors(corsOptions));

// Middleware to allow cross-origin requests
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8100'); // Replace with your frontend's URL
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow cookies, authorization headers with credentials

  if (req.method === 'OPTIONS') {
    res.sendStatus(200); // Preflight request response
  } else {
    next();
  }
});

mongoose.connect('mongodb+srv://admin:r3Kaz63Dl0fBMaxe@cluster0.jkjcwvg.mongodb.net/ScheduleDB', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const scheduleRouter = require('./routes/schedule');
const typeOfShiftRouter = require('./routes/typeOfShift');
const detailOfMonthRouter = require('./routes/detailOfMonth');
const roleRouter = require('./routes/role'); // นำเข้า role router
const userRouter = require('./routes/user'); // นำเข้า user router
const authRouter = require('./routes/auth'); // นำเข้า auth router

app.use('/schedules', scheduleRouter);
app.use('/typesOfShifts', typeOfShiftRouter);
app.use('/detailsOfMonths', detailOfMonthRouter);
app.use('/roles', roleRouter); // ใช้ role router
app.use('/users', userRouter); // ใช้ user router
app.use('/auth', authRouter); // ใช้ auth router

// app.listen(8080, () => {
//   console.log('Server started on port 8080');
// });

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});