const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');
const colors = require('colors');

exports.compileJava = function (envData , code , send ){

    const className = "Algorithm";
    const dirname = cuid.slug();
    const path = './temp/'+dirname;
    const compile = "cd " + path + " && javac " + className + ".java";
    const execute = "cd " + path + " && java " + className;
    const filename = className + ".java";

	fs.mkdir(path, 0777, function(err) {
		if(err)
		      console.log('ERROR: '.red + err);
		else {
			fs.writeFile(path + "/" + filename, code, function(err) {
				if(err)
					console.log('ERROR: '.red + err);
			    else {
			    	console.log('INFO: '.green + path + "/" + filename + " created");
                    var notFinished = true;
					exec(compile, function(error, stdout, stderr) {
						if(error) {
							console.log("INFO: ".green + path + "/" + className + " contained an error while compiling");
							var out = {error : stderr };
							send(out);
						}
						else {
							console.log("INFO: ".green + "compiled a java file");
                            const start = process.hrtime();
							exec(execute, function(error, stdout, stderr) {
								if(error) {
									if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
										var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'};
										send(out);
									}
									else {
										console.log('INFO: '.green + path  + '/' + className +'.java contained an error while executing');
										var out = { error : stderr};
										send(out);
									}
								}
								else {
                                    notFinished = false;
                                    const time = getPerformance(start);
									console.log('INFO: '.green + path + '/' + className + '.java successfully compiled and executed !');
									let out = { success : stdout, time: time };
									send(out);
								}
							});
						}
					});

                    if(envData.timeout) {
						setTimeout(function () {
							let pids = pid.split('\n');
							exec("kill "+ pids[0] + " " + pids[1], function(error, stdout, stderr) {
								if(notFinished) {
									if(error)
										return ERR(className + ' failed to be killed after ' + envData.timeout + 'ms.')
									notFinished = false;
									WARN(className + ' was killed after ' + envData.timeout + 'ms.');
									send({ timeout : true });
								}
							});
						}, envData.timeout);
					}

					exec('pgrep -f /bin/sh -c cd ./temp/' + className + '&& java Algorithm', function(err, stdout, stderr) {
					 	pid = stdout;
					});
			    }
			});
		}
	});
}
