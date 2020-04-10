const mongoose = require('mongoose');
const Score = require('../model/Score');

const RankingSchema = mongoose.Schema({
    idExercise: String,
    scores: String//[Score]
});

module.exports = mongoose.model('Ranking', RankingSchema);