const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/config');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
// const usersRoutes = require('./routes/UsersRoutes');
const musicsRoutes = require('./routes/MusicsRoutes');

connectDB();

app.use('/api/musics', musicsRoutes); // => /api/musics

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});