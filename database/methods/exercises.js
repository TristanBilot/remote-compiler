const Exercise = require('../model/Exercise');

var insertExercise = async (content, code, input, expected, funcName, paramName, tests) => {
    const ex = new Exercise({
        content: content,
        code: code,
        input: input,
        expected: expected,
        funcName: funcName,
        paramName: paramName,
        tests: tests
    });
    ex.save(function (err) {
        if (err) console.log(err);
        else console.log('=> exercise saved !')
    });
}

module.exports = {insertExercise}