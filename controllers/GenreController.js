const Genre = require('../models/GenreModel');

const createGenre = async (req, res) => {
    try {
        const { musicGenre, musicQuantity, isPublic, view } = req.body;
        const genre = new Genre({
            musicGenre,
            musicQuantity,
            isPublic,
            view,
        });
        await genre.save();
        res.status(201).json({ genre });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getFamousGenre = async (req, res) => {
    // try {
    //     const musicGenre = req.body.musicGenre;
    //     const musicQuantity = req.body.musicQuantity;
    //     const isPublic = req.body.isPublic;
    //     const view = req.body.view;
    //     const sortedGenres = await musicGenre.find().sort({ view: -1 });
    // }

}

const findGenre = async (req, res) => {
    
}

const changeGenreStatus = async (req, res) => {
}

module.exports = { createGenre ,getFamousGenre, findGenre, changeGenreStatus };