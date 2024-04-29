const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/config');

// Import routes
const authRoutes = require('./routes/AuthRoutes');
const musicsRoutes = require('./routes/routeClient/MusicsRoutes');
const playlistsRoutes = require('./routes/routeClient/PlaylistsRoutes');
const genreRoutes = require('./routes/routeClient/GenreRoutes');
const roomRoutes = require('./routes/routeClient/RoomRoutes');

const PORT = process.env.PORT || 5000;

// Load env variables
const dotenv = require('dotenv');
dotenv.config();

const socketIO = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.get('/api', (req, res) => {
  res.json({ message: 'Hello' });
});

http.listen(PORT, () => {
  console.log(`Server listening: http://localhost:${PORT}`);
});

app.use('/api/musics', musicsRoutes); // => /api/musics
app.use('/api/playlists', playlistsRoutes); // => /api/playlists
app.use('/api/genre', genreRoutes); // => /api/genre
app.use('/api/room', roomRoutes); // => /api/room

// Room storage
const rooms = {};
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // Join a room
  socket.on('joinRoom', ({ username, roomId }) => {
    // Create a new room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    // Add user to the room
    rooms[roomId].push({ id: socket.id, username });
    socket.join(roomId);
    // Send a message to the room that a new user has joined
    socketIO.to(roomId).emit('message', { username: 'Admin', message: `${username} has joined the room.` });
    // Send the updated user list to everyone in the room
    socketIO.to(roomId).emit('userList', rooms[roomId]);
  });

  // Send message to room
  socket.on('sendMessage', ({ roomId, username, message }) => {
    socketIO.to(roomId).emit('message', { username, message });
    console.log('🚀: ', { username, message });
  });

  // Leave room
  socket.on('leaveRoom', ({ roomId, username }) => {
    if (rooms[roomId]) {
      // check and remove user from room list if exists
      rooms[roomId] = rooms[roomId].filter((user) => user.id !== socket.id);
      // Send a message to the room that a user has left
      socketIO.to(roomId).emit('message', { username: 'Admin', message: `${username} has left the room.` });
      // Send the updated user list to everyone in the room
      socketIO.to(roomId).emit('userList', rooms[roomId]);
      socket.leave(roomId);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    // Remove user from all rooms
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((user) => user.id !== socket.id);
      // send updated user list to everyone in the room
      socketIO.to(roomId).emit('userList', rooms[roomId]);
    }
  });
});
