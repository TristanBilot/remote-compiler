const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');

exports.compileObjC = function (envData, code, send) {
    const filename = cuid.slug();
    const file = filename + '.m'
    const path = './temp/';
    const compile = 'clang -framework Foundation ' + path + file + ' -o ' + path + filename;
    const execute = path + filename;

    fs.writeFile(path + file, code, function(err) {
        if(err)
            return ERR(err);

        exec(compile, function(error, stdout, stderr) {
            if (errorManager(file, error, stderr, send))
                return;
            INFO(file + succ_compiling);
            const start = process.hrtime();

            exec(execute, function(error, stdout, stderr) {
                if (errorManager(file, error, stderr, send))
                    return;
                const time = getPerformance(start);
                INFO(file + succ_executing);
                send({ success : stdout, time: time });
            });
        });
    });
}
