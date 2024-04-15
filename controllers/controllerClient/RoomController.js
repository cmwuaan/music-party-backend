const Room = require('../../models/RoomModel');
const RoomTable = require('../../entity/RoomTable');
const MessageRoom = require('../../models/MessageModel');
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

const removeMusicToRoomPlaylist = async (req, res) => {
    try {
        const { roomID, musicID } = req.body;
        if (!roomID || !musicID) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }
        const room = await Room.findById(roomID);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if (!room.musicInQueue.includes(musicID)) {
            return res.status(400).json({ message: 'Music not found in room' });
        }
        const updateRoom = await Room.findByIdAndUpdate(roomID, {
            $pull: { musicInQueue: musicID }
        });
        await room.save();
        return res.status(200).json({ message: 'success', data: updateRoom });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const getCurrentRoomMusic = async (req, res) => {
    try {
        const { roomID } = req.body;
        if (!roomID) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }
        const room = await Room.findById(roomID);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const currentMusic = await Room.findById(roomID).populate('currentMusicPlay');
        return res.status(200).json({ currentMusic });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// const getRoomByID = async (req, res){
//     try {
        
//     }
// }

module.exports = { postRoom, postNewMusicToRoomPlaylist, removeMusicToRoomPlaylist, getCurrentRoomMusic };