const Exercise = require('../model/Exercise');

var insertExercise = async (content, code, input, expected, tests) => {
    const ex = new Exercise({
        content: content,
        code: code,
        input: input,
        expected: expected,
        tests: tests
    });
    ex.save(function (err) {
        if (err) console.log(err);
        else console.log('=> exercise saved !')
    });
}

module.exports = {insertExercise}