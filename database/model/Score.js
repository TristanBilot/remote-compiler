const mongoose = require('mongoose');

const ScoreSchema = mongoose.Schema({
    score: String,
    idExercise: String,
    idPlayer: String
});

module.exports = mongoose.model('Score', ScoreSchema);