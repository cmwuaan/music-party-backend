require('dotenv').config();

const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const errorHandler = require('./middleware/errorHandler.js');
const AppError = require('./middleware/appError.js');
const { socketInit } = require('./middleware/socketIO.js');
const { authClientWeb, authAdminWeb } = require('./authentication/auth.js');

const secretSessionKeyClient = process.env.SECRET_SESSION_KEY || 'group3';
const secretSessionKeyAdmin = process.env.SECRET_SESSION_KEY_ADMIN || 'group3';

const PORT = process.env.PORT;
const ADMIN_PORT = process.env.ADMIN_PORT;
// const CLIENT_URL = 'http://localhost:3000';
// const ADMIN_URL = 'http://localhost:3001';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const connect = async () => {
  try {
    await mongoose.connect(DB);
    console.log('Connect to mongoDB');
  } catch (error) {
    console.log(error);
  }
};
connect();
const db = mongoose.connection;

// Start express client app
const clientApp = express();

// var allowedOrigins = [CLIENT_URL, ADMIN_URL];

// Implement CORS
// clientApp.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         var msg =
//           'The CORS policy for this site does not ' +
//           'allow access from the specified Origin.';
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     methods: 'GET,POST,PUT,DELETE',
//     credentials: true,
//   }),
// );

clientApp.use(cors());
// Access-Control-Allow-Origin *
clientApp.options('*', cors());

// Set security HTTP headers
clientApp.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
clientApp.use('/api', limiter);

// Body parser, reading data from body into req.body
clientApp.use(express.json({ limit: '10kb' }));
clientApp.use(express.urlencoded({ extended: true, limit: '10kb' }));
clientApp.use(errorHandler);
clientApp.use(cookieParser());
clientApp.set('trust proxy', 1); // Only needed for proxy

// Data sanitization against NoSQL query injection
clientApp.use(mongoSanitize());

// Data sanitization against XSS
clientApp.use(xss());
clientApp.use(hpp());
clientApp.use(compression());

// ROUTES
clientApp.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Music Party' });
});

// Mounting routers
clientApp.use(
  session({
    store: MongoStore.create({ mongoUrl: DB }),
    secret: secretSessionKeyClient,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // Only set it to true if you use https
      sameSite: 'none', // Only set it to none if you use https
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  }),
);
clientApp.use(authClientWeb.initialize());
clientApp.use(authClientWeb.session());
clientApp.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

clientApp.use('/auth', require('./route/routeClient/authClientRoute.js'));
clientApp.use('/api/v1/user', require('./route/routeClient/userRoute.js'));
clientApp.use('/api/v1/music', require('./route/routeClient/musicRoute.js'));
clientApp.use('/api/v1/genre', require('./route/routeClient/genreRoute.js'));
clientApp.use(
  '/api/v1/playlist',
  require('./route/routeClient/playlistRoute.js'),
);
clientApp.use('/api/v1/room', require('./route/routeClient/roomRoute.js'));

const server = http.createServer(clientApp);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

socketInit(io);

server.listen(PORT, () => {
  console.log(`Client app server run on port ${PORT}`);
});

clientApp.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ----------------------------------------- //
// Start express client app
const adminApp = express();

// adminApp.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         var msg =
//           'The CORS policy for this site does not ' +
//           'allow access from the specified Origin.';
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     methods: 'GET,POST,PUT,DELETE',
//     credentials: true,
//   }),
// );

adminApp.use(cors());
// Access-Control-Allow-Origin *
adminApp.options('*', cors());

// Set security HTTP headers
adminApp.use(helmet());
adminApp.use('/api', limiter);

// Body parser, reading data from body into req.body
adminApp.use(express.json({ limit: '10kb' }));
adminApp.use(express.urlencoded({ extended: true, limit: '10kb' }));
adminApp.use(errorHandler);
adminApp.use(cookieParser());
adminApp.set('trust proxy', 1); // Only needed for proxy

// Data sanitization against NoSQL query injection
adminApp.use(mongoSanitize());

// Data sanitization against XSS
adminApp.use(xss());
adminApp.use(hpp());
adminApp.use(compression());

// ROUTES
adminApp.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Music Party' });
});

// Mounting routers
adminApp.use(
  session({
    store: MongoStore.create({ mongoUrl: DB }),
    secret: secretSessionKeyAdmin,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // Only set it to true if you use https
      sameSite: 'none', // Only set it to none if you use https
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  }),
);
adminApp.use(authAdminWeb.initialize());
adminApp.use(authAdminWeb.session());
adminApp.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

adminApp.use('/auth', require('./route/routeAdmin/authAdminRoute.js'));
adminApp.use('/api/v1/user', require('./route/routeAdmin/userAdminRoute.js'));
adminApp.use('/api/v1/music', require('./route/routeAdmin/musicAdminRoute.js'));
adminApp.use(
  '/api/v1/playlist',
  require('./route/routeAdmin/playlistAdminRoute.js'),
);

const adminServer = http.createServer(adminApp);

adminServer.listen(ADMIN_PORT, () => {
  console.log(`Admin app server run on port ${ADMIN_PORT}`);
});

adminApp.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
