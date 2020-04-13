const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');

exports.compileJava = function (options, code, send) {
    const className = "Algorithm";
    const dirname = cuid.slug();
    const path = './temp/'+ dirname;
    const compile = "cd " + path + " && javac " + className + ".java";
    const execute = "cd " + path + " && java " + className;
    const filename = className + ".java";

	fs.mkdir(path, 0777, function(err) {
		if(err)
		      return ERR(err);
		fs.writeFile(path + "/" + filename, code, function(err) {
			if(err)
				return ERR(err);
            var notFinished = true;

			exec(compile, function(error, stdout, stderr) {
                if (errorManager(dirname, error, stderr, send, stdout))
                    return notFinished = false;
				INFO(filename + succ_compiling);
                const start = process.hrtime();

				exec(execute, function(error, stdout, stderr) {
					if (errorManager(dirname, error, stderr, send, stdout))
                        return notFinished = false;
                    const time = getPerformance(start);
					INFO(filename + succ_executing);
					send({ success : stdout, time: time });
				});
			});

            if (options.timeout) {
				setTimeout(function() {
					let pids = pid.split('\n');
					exec("kill "+ pids[0] + " " + pids[1], function(error, stdout, stderr) {
						if (notFinished) {
							if (error)
								return ERR(className + ' failed to kill after ' + options.timeout + 'ms.')
							notFinished = false;
							WARN(className + ' was killed after ' + options.timeout + 'ms.');
							send({ timeout : true });
						}
					});
				}, options.timeout);
			}
			exec('pgrep -f /bin/sh -c cd ./temp/' + className + '&& java Algorithm', function(err, stdout, stderr) {
			 	pid = stdout;
			});
		});
	});
}
