const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');
const colors = require('colors');

const path = './temp/';

exports.compileCPP = function(envData, code, send) {
	var filename = cuid.slug();
	var file;
	var command;
	var child;

	if(envData.cmd === 'g++') {
		file = filename + '.cpp';
		commmand = 'g++ ' + path + file + ' -o '+ path + filename;
	}
	else if (envData.cmd === 'gcc') {
		file = filename + '.c';
		commmand = 'gcc ' + path + file + ' -o '+ path + filename;
	}
	else
		return ERR('choose either g++ or gcc.');

	fs.writeFile(path + filename +'.cpp', code, function(err) {
		if(err)
			ERR(err);
		else {
			INFO(file + ' created.');

			/* COMPILATION */
			exec(commmand, function(error, stdout, stderr) {
				if(error) {
					INFO(file + err_compiling);
					send({ error : stderr });
				}
				else {
					INFO(file + succ_compiling);
					commmand = "cd temp && ./" + filename;
					var notFinished = true;
					const start = process.hrtime();

					/* EXECUTION */
					exec(commmand,  function(error, stdout, stderr) {
						if(error) {
							if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
								send({ error : error + err_infinite_loop });
							else {
								WARN(file + err_executing);
								send({ error : stderr });
							}
						}
						else {
							const time = getPerformance(start);
							if(notFinished) {
								notFinished = false;
								INFO(file + succ_executing);
								send({ success : stdout, time: time });
							}
						}
					});

					if(envData.timeout) {
						setTimeout(function () {
							let pids = pid.split('\n');
							exec("kill "+ pids[0] + " " + pids[1], function(error, stdout, stderr) {
								if(notFinished) {
									if(error)
										return ERR(file + ' failed to be killed after ' + envData.timeout + 'ms.')
									notFinished = false;
									WARN(file + ' was killed after ' + envData.timeout + 'ms.');
									send({ timeout : true });
								}
							});
						}, envData.timeout);
					}

					exec('pgrep -f ./' + filename, function(err, stdout, stderr) {
					 	pid = stdout;
					});
				}
			});


		}
	});
}
