require('dotenv').config();
const Genre = require('../../model/GenreModel');
const asyncHandler = require('express-async-handler');

const getMostFamousGerne = asyncHandler(async (req, res) => {
  try {
    const musicname = req.query.music_name;
    const quantity = req.query.quantity || 1000;
    const index = req.query.index || 0;
    const desc = req.query.desc || -1;
    const genre = await Genre.find({}) // Find all genre
      .sort({ musicQuantity: -1 }); // Sort by musicQuantity
    res.status(200).json({ message: 'Success', data: genre }); // Return data with 50 items
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' }); // Return error if server error
  }
});

const findGerne = asyncHandler(async (req, res) => {
  try {
    const genreName = req.query.genrename;
    const genreNameRegex = new RegExp('^' + genreName, 'i');
    const genre = await Genre.find({
      musicGenre: { $regex: genreNameRegex },
    });
    res.status(200).json({ message: 'Success', data: genre });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const changeGerneStatus = asyncHandler(async (req, res) => {
  try {
    const { musicGenre, isPublic } = req.body;
    Genre.updateOne(
      { _id: req.params.id },
      { $set: { musicGenre: musicGenre, isPublic: isPublic } },
    );
  } catch (ex) {
    res.sendStatus(400);
  }
});
module.exports = { findGerne, getMostFamousGerne, changeGerneStatus };
