require('dotenv').config();
require('express-async-errors');
const express = require('express');
const authRoutes = require('./routes/auth');
const schedule = require('node-schedule');
const PasswordReset = require('./models/PasswordReset');

// extra security packages
const helmet = require('helmet')
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit')
const winston = require('winston');

// Create a logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, message }) => {
      return `[${timestamp}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' }), // You can customize the log file location
  ],
});


// ConnectDb
const connectDB = require('./db/connect');
const app = express();

// Middleware to log requests
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.url}`);
  next();
});

// error handler
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');

app.use('/public',express.static('public'))
app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())



// routes
app.get('/', (req, res) => {
  res.send('Express boilerplate is successful');
});

app.use('/api/auth',authRoutes)



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
