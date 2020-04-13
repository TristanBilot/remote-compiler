const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');

exports.compilePython = function (envData, code, send) {
	const filename = cuid.slug();
	const path = './temp/';
	const execute = 'python ' + path + filename + '.py';

	fs.writeFile(path + filename + '.py', code, function(err) {
		if(err)
			return ERR(err);
		const start = process.hrtime();

		exec(execute, function(error, stdout, stderr) {
			if (errorManager(filename, error, stderr, send, stdout))
                return;
			const time = getPerformance(start);
			INFO(filename + '.py' + succ_executing);
			send({ success : stdout, time: time });
	    });// some comment test
	});
}
