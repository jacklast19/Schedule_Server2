const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://admin3:0Gf7FTKi5hEfEPfr@cluster0.jkjcwvg.mongodb.net/ScheduleDB', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const scheduleRouter = require('./routes/schedule');
const typeOfShiftRouter = require('./routes/typeOfShift');
const detailOfMonthRouter = require('./routes/detailOfMonth');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');

app.use('/schedules', scheduleRouter);
app.use('/typesOfShifts', typeOfShiftRouter);
app.use('/detailsOfMonths', detailOfMonthRouter);



app.listen(8080, () => {
  console.log('Server started on port 8080');
});
