const Exercise = require('../model/Exercise');

var insertExercise = async (content, code, funcName, paramName, tests) => {
    const ex = new Exercise({
        content: content,
        code: code,
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