const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

app.use(bodyParser.json());

// CORS middleware configuration
const corsOptions = {
  origin: ['http://localhost:8100', 'http://localhost:8081'], // Allow requests from these origins
  credentials: true,            // Allow sending cookies and authentication headers
  optionSuccessStatus: 200      // For legacy browser support
};

// Middleware to allow cross-origin requests
app.use(function(req, res, next) {
  const allowedOrigins = ['http://localhost:8100', 'http://localhost:8081'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin); // Set the origin dynamically
  }
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow cookies, authorization headers with credentials

  if (req.method === 'OPTIONS') {
    res.sendStatus(200); // Preflight request response
  } else {
    next();
  }
});

// MongoDB connection using Mongoose
mongoose.connect('mongodb+srv://admin:r3Kaz63Dl0fBMaxe@cluster0.jkjcwvg.mongodb.net/ScheduleDB', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB using Mongoose');
});

// MongoDB connection using MongoClient
const uri = "mongodb+srv://admin:r3Kaz63Dl0fBMaxe@cluster0.jkjcwvg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB using MongoClient!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// Import routers
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
const shiftSwapRouter = require('./routes/shiftSwap');
const leaveBalanceRouter = require('./routes/leaveBalance');
const approvalRouter = require('./routes/approvals')

// Use routers
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
app.use('/shiftSwaps', shiftSwapRouter);
app.use('/leaveBalances', leaveBalanceRouter);
app.use('/approvals',approvalRouter);

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
