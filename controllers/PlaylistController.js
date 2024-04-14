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


const addNewSongToPlaylist = async (req, res) => {
    try {
        const { playlistID, musicID } = req.body;
        console.log(playlistID, musicID);
        if (!playlistID || !musicID) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }
        
        const playlist = await Playlist.findById(playlistID);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        if (playlist.listMusic.includes(musicID)) {
            return res.status(400).json({ message: 'Music already exists in playlist' });
        }

        playlist.listMusic.push(musicID);
        await playlist.save();

        res.status(200).json({ playlist });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const removeSongFromPlaylist = async (req, res) => {
    try {
        const { playlistID, musicID } = req.body;
        console.log(playlistID, musicID);
        if (!playlistID || !musicID) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }
        const playlist = await Playlist.findById(playlistID);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        if (!playlist.listMusic.includes(musicID)) {
            return res.status(400).json({ message: 'Music not found in playlist' });
        }

        const updatePlaytlist = await Playlist.findByIdAndUpdate(playlistID, {
            $pull: { listMusic: musicID }
        });

        await playlist.save();
        return res.status(200).json({message:'success', data: updatePlaytlist})
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const deletePlaylistByID = async (req, res) => {
    try {
        const { playlistID } = req.body;
        if (!playlistID) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }
        const playlist = await Playlist.findById(playlistID);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        await Playlist.findByIdAndDelete(playlistID);
        return res.status(200).json({ message: 'success' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {CreatePlaylist, addNewSongToPlaylist, removeSongFromPlaylist, deletePlaylistByID};