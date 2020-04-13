const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');

exports.compileSwift = function (options, code, send) {
    const file = cuid.slug() + '.swift';
    const path = './temp/' + file;
    const chmod = 'chmod +x ' + path;
    const execute = path;

    fs.writeFile(path, code, function(err) {
        if(err)
            return ERR(err);

        exec(chmod, function(error, stdout, stderr) {
            if (errorManager(file, error, stderr, send, stdout))
                return;
            var notFinished = true;
            const start = process.hrtime();
            
            exec(execute, function(error, stdout, stderr) {
                if (errorManager(file, error, stderr, send, stdout))
                    return notFinished = false;
                
                const time = getPerformance(start);
                INFO(file + succ_executing);
                send({ success : stdout, time: time });
            });
            processKiller(notFinished, options.timeout, send, 'Swift', file);

            // if (options.timeout) {
			// 	setTimeout(function () {
            //         if (notFinished) {
            //             exec("kill $(ps aux | grep '/Applications/Xcode.app/Contents/Developer/Toolchains/*' | awk '{print $2}')", function(err, stdout, stderr) {
            //                 if(error)
			// 					return ERR(file + ' failed to be killed after ' + options.timeout + 'ms.');
            //                 notFinished = false;
			// 				WARN(file + ' was killed after ' + options.timeout + 'ms.');
			// 				return send({ timeout : true });
            //             });
            //         }
			// 	}, options.timeout);
			// }
			
        });
    });
}
