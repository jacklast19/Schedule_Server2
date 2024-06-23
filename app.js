const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://admin:r3Kaz63Dl0fBMaxe@cluster0.jkjcwvg.mongodb.net/ScheduleDB', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const scheduleRouter = require('./routes/schedule');
const typeOfShiftRouter = require('./routes/TypeOfshift');
const detailOfMonthRouter = require('./routes/detailOfMonth'); 
const departmentRouter = require('./routes/department');
const roleRouter = require('./routes/role'); 
const userRouter = require('./routes/user'); 
const authRouter = require('./routes/auth'); 
const otRouter = require('./routes/ot'); 
const leaveRouter = require('./routes/leave');
const documentRouter = require('./routes/document');

app.use('/schedules', scheduleRouter);
app.use('/typesOfShifts', typeOfShiftRouter);
app.use('/detailsOfMonths', detailOfMonthRouter);
app.use('/departments', departmentRouter);
app.use('/roles', roleRouter); 
app.use('/users', userRouter); 
app.use('/auth', authRouter); 
app.use('/ot', otRouter);
app.use('/leaves', leaveRouter);
app.use('/documents', documentRouter);

app.listen(8080, () => {
  console.log('Server started on port 8080');
});
