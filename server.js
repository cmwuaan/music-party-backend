// const express = require('express');
// const bodyParser = require('body-parser');
// const connectDB = require('./config/config');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;
// app.use(bodyParser.json());
// // const usersRoutes = require('./routes/UsersRoutes');
// const musicsRoutes = require('./routes/routeClient/MusicsRoutes');
// const playlistsRoutes = require('./routes/routeClient/PlaylistsRoutes');
// const genreRoutes = require('./routes/routeClient/GenreRoutes');
// const roomRoutes = require('./routes/routeClient/RoomRoutes');


// connectDB();

// app.use('/api/musics', musicsRoutes); // => /api/musics
// app.use('/api/playlists', playlistsRoutes); // => /api/playlists
// app.use('/api/genre', genreRoutes); // => /api/genre
// app.use('/api/room', roomRoutes); // => /api/room

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on PORT ${PORT}`);
// });


// //////////////////////////

// const http = require('http').Server(app);
// const cors = require('cors');
// const socketIO = require('socket.io')(http, {
//     cors: {
//         origin: "http://localhost:3000"
//     }
// });
// app.use(cors());
// const rooms = {};
// socketIO.on('connection', (socket) => {
//     console.log(`⚡: ${socket.id} user just connected!`);

//     // Tham gia phòng chat
//     socket.on('joinRoom', ({ username, roomId }) => {
//         // Tạo phòng mới nếu nó chưa tồn tại
//         if (!rooms[roomId]) {
//             rooms[roomId] = [];
//         }
//         // Thêm người dùng vào phòng
//         rooms[roomId].push({ id: socket.id, username });
//         socket.join(roomId);
//         // Gửi tin nhắn chào mừng cho tất cả thành viên trong phòng
//         socketIO.to(roomId).emit('message', { username: 'Admin', message: `${username} has joined the room.` });
//         // Gửi danh sách người dùng trong phòng cho tất cả thành viên trong phòng
//         socketIO.to(roomId).emit('userList', rooms[roomId]);
//     });

//     // Gửi tin nhắn trong phòng
//     socket.on('sendMessage', ({ roomId, username, message }) => {
//         socketIO.to(roomId).emit('message', { username, message });
//         console.log('🚀: ', { username, message });
//     });


//     // Thoát phòng chat
//     socket.on('leaveRoom', ({ roomId, username }) => {
//         if (rooms[roomId]) {
//             // Xóa người dùng khỏi danh sách
//             rooms[roomId] = rooms[roomId].filter(user => user.id !== socket.id);
//             // Thông báo cho phòng rằng người dùng đã rời khỏi phòng
//             socketIO.to(roomId).emit('message', { username: 'Admin', message: `${username} has left the room.` });
//             // Gửi danh sách người dùng cập nhật cho tất cả thành viên trong phòng
//             socketIO.to(roomId).emit('userList', rooms[roomId]);
//             socket.leave(roomId);
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('🔥: A user disconnected');
//         // Kiểm tra và xóa người dùng khỏi danh sách của phòng nếu có
//         for (const roomId in rooms) {
//             rooms[roomId] = rooms[roomId].filter(user => user.id !== socket.id);
//             // Gửi danh sách người dùng cập nhật cho tất cả thành viên trong phòng
//             socketIO.to(roomId).emit('userList', rooms[roomId]);
//         }
//     });
// });




const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const connectDB = require('./config/config');
const dotenv = require('dotenv');
dotenv.config();
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3001"
    }
});

const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
const musicsRoutes = require('./routes/routeClient/MusicsRoutes');
const playlistsRoutes = require('./routes/routeClient/PlaylistsRoutes');
const genreRoutes = require('./routes/routeClient/GenreRoutes');
const roomRoutes = require('./routes/routeClient/RoomRoutes');
app.use(cors());
connectDB();
app.use('/api/musics', musicsRoutes); // => /api/musics
app.use('/api/playlists', playlistsRoutes); // => /api/playlists
app.use('/api/genre', genreRoutes); // => /api/genre
app.use('/api/room', roomRoutes); // => /api/room
// Dùng một đối tượng để lưu trữ thông tin của các phòng chat
const rooms = {};

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    // Tham gia phòng chat
    socket.on('joinRoom', ({ username, roomId }) => {
        // Tạo phòng mới nếu nó chưa tồn tại
        if (!rooms[roomId]) {
            rooms[roomId] = [];
        }
        // Thêm người dùng vào phòng
        rooms[roomId].push({ id: socket.id, username });
        socket.join(roomId);
        // Gửi tin nhắn chào mừng cho tất cả thành viên trong phòng
        socketIO.to(roomId).emit('message', { username: 'Admin', message: `${username} has joined the room.` });
        // Gửi danh sách người dùng trong phòng cho tất cả thành viên trong phòng
        socketIO.to(roomId).emit('userList', rooms[roomId]);
    });

    // Gửi tin nhắn trong phòng
    socket.on('sendMessage', ({ roomId, username, message }) => {
        socketIO.to(roomId).emit('message', { username, message });
        console.log('🚀: ', { username, message });
    });


    // Thoát phòng chat
    socket.on('leaveRoom', ({ roomId, username }) => {
        if (rooms[roomId]) {
            // Xóa người dùng khỏi danh sách
            rooms[roomId] = rooms[roomId].filter(user => user.id !== socket.id);
            // Thông báo cho phòng rằng người dùng đã rời khỏi phòng
            socketIO.to(roomId).emit('message', { username: 'Admin', message: `${username} has left the room.` });
            // Gửi danh sách người dùng cập nhật cho tất cả thành viên trong phòng
            socketIO.to(roomId).emit('userList', rooms[roomId]);
            socket.leave(roomId);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        // Kiểm tra và xóa người dùng khỏi danh sách của phòng nếu có
        for (const roomId in rooms) {
            rooms[roomId] = rooms[roomId].filter(user => user.id !== socket.id);
            // Gửi danh sách người dùng cập nhật cho tất cả thành viên trong phòng
            socketIO.to(roomId).emit('userList', rooms[roomId]);
        }
    });
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello" });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
