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

module.exports = { postRoom };