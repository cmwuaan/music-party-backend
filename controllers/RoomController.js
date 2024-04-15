const Room = require('../models/RoomModel');
const RoomTable = require('../entity/RoomTable');
const MessageRoom = require('../models/MessageModel');

const postRoom = async (req, res) => {
    try {
        const { roomName, roomOwner, roomType } = req.body;
        const room = new Room({
            roomName,
            roomOwner,
            roomType: roomType ? roomType : RoomTable.PRIVATE_ROOM
        });
        await room.save();
        res.status(201).json({ room });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const postNewMusicToRoomPlaylist = async (req, res) => {
    try {
        const { roomID, musicID } = req.body;
        if (!roomID || !musicID) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }
        const room = await Room.findById(roomID);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if (room.musicInQueue.includes(musicID)) {
            return res.status(400).json({ message: 'Music already exists in room' });
        }
        room.musicInQueue.push(musicID);
        await room.save();
        res.status(200).json({ room });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = { postRoom, postNewMusicToRoomPlaylist };