const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const errorHandler = require('./middleware/errorHandler.js');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const deviceRouter = require('./routes/deviceRoutes');
const sensorRouter = require('./routes/sensorRoutes');
const connectionRouter = require('./routes/connectionRoutes');

// Start express client app
const clientApp = express();

// clientApp.set('trust proxy', 1);

// Implement CORS
clientApp.use(
  cors({
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === 'production') {
        if (!origin || origin.startsWith('http://localhost')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        callback(null, true);
      }
    },
    methods: 'GET, POST, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  })
);

// Set security HTTP headers
clientApp.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  clientApp.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP,   please try again in an hour!',
});
clientApp.use('/api', limiter);

// Body parser, reading data from body into req.body
clientApp.use(express.json({ limit: '10kb' }));
clientApp.use(express.urlencoded({ extended: true, limit: '10kb' }));
clientApp.use(cookieParser());

// Data sanitization against NoSQL query injection
clientApp.use(mongoSanitize());

// Data sanitization against XSS
clientApp.use(xss());
clientApp.use(hpp());
clientApp.use(compression());

// ROUTES
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from the server side!', app: 'Music Party' });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/devices', deviceRouter);
app.use('/api/v1/sensors', sensorRouter);
app.use('/api/v1/connections', connectionRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
