const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/config');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/AuthRoutes');
const usersRoutes = require('./routes/UsersRoutes');
const musicsRoutes = require('./routes/MusicsRoutes');

// Load env variables
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  })
);

// Connect to database
connectDB();

// Routes
app.use('/auth', authRoutes); // => /auth
app.use('/api/users', usersRoutes); // => /api/users
app.use('/api/musics', musicsRoutes); // => /api/musics

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
