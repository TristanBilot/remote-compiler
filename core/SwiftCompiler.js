const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');

exports.compileSwift = function (envData, code, send) {
    const file = cuid.slug() + '.swift';
    const path = './temp/' + file;
    const chmod = 'chmod +x ' + path;
    const execute = path

    fs.writeFile(path, code, function(err) {
        if(err)
            return ERR(err);

        exec(chmod, function(error, stdout, stderr) {
            if (errorManager(file, error, stderr, send))
                return;
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
