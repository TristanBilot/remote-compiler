const mongoose = require('mongoose');
const Ranking = require('../model/Ranking');

const ExerciseSchema = mongoose.Schema({
    content: String,
    code: Object,
    input: String,
    expected: String, /* first test */
    funcName: String,
    paramName: [String],
    tests: Object,
    ranking: String//Ranking
});

module.exports = mongoose.model('Exercise', ExerciseSchema);