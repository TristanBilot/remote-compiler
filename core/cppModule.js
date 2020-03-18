var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');

const path = './temp/';

exports.compileCPP = function(envData, code, fn) {
	let filename = cuid.slug();

	fs.writeFile(path + filename +'.cpp', code, function(err) {
		if(err)
			console.log('ERROR: '.red + err);
		else {
			console.log('INFO: '.green + filename +'.cpp created');
			var command;
			if(envData.cmd === 'g++')
				commmand = 'g++ ' + path + filename +'.cpp -o '+ path + filename;
			else if (envData.cmd === 'gcc')
				commmand = 'gcc ' + path + filename +'.cpp -o '+ path + filename;
			else {
				console.log('ERROR: '.red + 'choose either g++ or gcc ');
				return;
			}
			/* COMPILATION */
			exec(commmand, function(error, stdout, stderr) {
				if(error) {
					console.log('INFO: '.yellow + filename + '.cpp contained an error while compiling');
					var out = { error : stderr };
					fn(out);
				}
				else {
					var progNotFinished = true;
					commmand = "cd temp && ./" + filename;
					exec(commmand, function(error, stdout, stderr) {
						if(error) {
							if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
								var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
								fn(out);
							}
							else {
								console.log('INFO: '.yellow + filename + '.cpp contained an error while executing');
								var out = { error : stderr };
								fn(out);
							}
						}
						else {
							if(progNotFinished) {
								progNotFinished = false;
								console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
								var out = { output : stdout};
								fn(out);
							}
						}
					});
					if(envData.timeout) {
						setTimeout(function () {
							exec("taskkill /im "+filename+" /f > nul",function( error , stdout , stderr ) {
								if(progNotFinished) {
									progNotFinished = false;
									console.log('INFO: '.yellow + filename + ' was killed after '+ envData.timeout + 'ms');
									var out = { timeout : true};
									fn(out);
								}
							});
						},envData.timeout);
					}
				}
			});
		}
	});
}
