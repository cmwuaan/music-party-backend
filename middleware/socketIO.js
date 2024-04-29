const Music = require('../models/MusicModel');
const Room = require('../models/RoomModel');

const roomTimers = {};
const socketInit = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join-room', async (roomID) => {
      socket.join(roomID);
      console.log('a user join room', roomID);
    });

    socket.on('add-music-to-room', async ({ roomID, musicID }) => {
      try {
        const room = await Room.findById(roomID);
        if (!room) {
          return socket.emit('add-music-to-room', { message: 'Room not found' });
        }
        if (room.musicInQueue.includes(musicID)) {
          return socket.emit('add-music-to-room', { message: 'Music already exists in room' });
        }
        room.musicInQueue.push(musicID);
        await room.save();
        io.to(roomID).emit('add-music-to-room', { room });
      } catch (err) {
        console.error(err.message);
        socket.emit('add-music-to-room', { message: 'Server Error' });
      }
    });

    socket.on('remove-music-to-room', async ({ roomID, musicID }) => {
      try {
        const room = await Room.findById(roomID);
        if (!room) {
          return socket.emit('remove-music-to-room', { message: 'Room not found' });
        }
        if (!room.musicInQueue.includes(musicID)) {
          return socket.emit('remove-music-to-room', { message: 'Music not found in room' });
        }
        const updateRoom = await Room.findByIdAndUpdate(roomID, {
          $pull: { musicInQueue: musicID },
        });
        await room.save();
        io.to(roomID).emit('remove-music-to-room', { message: 'success', data: updateRoom });
      } catch (err) {
        console.error(err.message);
        socket.emit('remove-music-to-room', { message: 'Server Error' });
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

module.exports = socketInit;
