const Playlist = require('../models/PlaylistModel');
const { uploadBytes, getDownloadURL } = require('firebase/storage');
const { firebaseStorage, ref } = require('../utils/Firebase');


const CreatePlaylist = async (req, res) => {
    try {
        const { playlistName, ownerPlaylistID, description } = req.body;

        if (!playlistName || !ownerPlaylistID || !description) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const avatarPlaylist = req.files['avatarPlaylist'][0];
        if (!avatarPlaylist) {
            return res.status(400).json({ message: 'Please upload an avatar file' });
        }

        const avatarRef = ref(firebaseStorage, `avatarPlaylist/${avatarPlaylist.originalname}`);
        const avatarSnapshot = await uploadBytes(avatarRef, avatarPlaylist.buffer);

        const playlist = new Playlist({
            playlistName,
            ownerPlaylistID,
            description,
            avatarPlaylist: await getDownloadURL(avatarSnapshot.ref),
        });

        await playlist.save();

        res.status(201).json({ playlist });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


module.exports = {CreatePlaylist};