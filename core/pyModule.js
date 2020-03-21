const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');
const colors = require('colors');

exports.compilePython = function (envData, code, send) {

	const filename = cuid.slug();
	const path = './temp/';
	const execute = 'python ' + path + filename + '.py';

	fs.writeFile(path + filename + '.py', code, function(err) {
		if(err)
			console.log('ERROR: '.red + err);
	    else {
	    	console.log('INFO: '.green + filename +'.py created');
			const start = process.hrtime();
			exec(execute, function(error, stdout, stderr) {
				if(error) {
					if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
						var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
						send(out);
					}
					else {
						console.log('INFO: '.green + filename + '.py contained an error while executing');
						var out = { error : stderr };
						send(out);
					}
				}
				else {
					const time = getPerformance(start);
					console.log('INFO: '.green + filename + '.py successfully executed !');
					let out = { success : stdout, time: time };
					send(out);
				}
		    });
		}
	});
}
