const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');

exports.compileCPP = function(options, code, send) {
	const filename = cuid.slug();
	const path = './temp/';
	var file;
	var compile;

	if(options.cmd === 'g++') {
		file = filename + '.cpp';
		compile = 'g++ ' + path + file + ' -o '+ path + filename;
	}
	else if (options.cmd === 'gcc') {
		file = filename + '.c';
		compile = 'gcc ' + path + file + ' -o '+ path + filename;
	}
	else
		return ERR('choose either g++ or gcc.');

	fs.writeFile(path + file, code, function(err) {
		if (err)
			return ERR(err);

		exec(compile, function(error, stdout, stderr) {
			if (error) {
				ERR(file + err_compiling);
				return send({ error : stderr });
			}
			INFO(file + succ_compiling);
			var execute = "cd temp && ./" + filename;
			var notFinished = true;
			const start = process.hrtime();

			exec(execute, function(error, stdout, stderr) {
				if (errorManager(file, error, stderr, send, stdout))
                	return notFinished = false;
				const time = getPerformance(start);
				if (notFinished) {
					notFinished = false;
					INFO(file + succ_executing);
					return send({ success : stdout, time: time });
				}
			});
			processKiller(notFinished, options.timeout, send, 'C++', filename);

			// if(options.timeout) {
			// 	setTimeout(function () {
			// 		let pids = pid.split('\n');
			// 		exec("kill "+ pids[0] + " " + pids[1], function(error, stdout, stderr) {
			// 			if(notFinished) {
			// 				if(error)
			// 					return ERR(file + ' failed to be killed after ' + options.timeout + 'ms.')
			// 				notFinished = false;
			// 				WARN(file + ' was killed after ' + options.timeout + 'ms.');
			// 				return send({ timeout : true });
			// 			}
			// 		});
			// 	}, options.timeout);
			// }
			// exec('pgrep -f ./' + filename, function(err, stdout, stderr) {
			//  	pid = stdout;
			// });
		});
	});
}
