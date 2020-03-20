const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');
const colors = require('colors');
const utils = require('./utils');


exports.compileJava = function (envData , code , send ){

    const className = "Algorithm";
    const dirname = cuid.slug();
    const path = './temp/'+dirname;
    const compile = "cd " + path + " && javac " + className + ".java";
    const execute = "cd " + path + " && java " + className;

	fs.mkdir(path, 0777, function(err) {
		if(err)
		      console.log('ERROR: '.red + err);
		else {
			fs.writeFile(path + "/" + className + ".java", code, function(err) {
				if(err)
					console.log('ERROR: '.red + err);
			    else {
			    	console.log('INFO: '.green + path + "/" + className + ".java created");

					exec(compile , function(error, stdout, stderr) {
						if(error) {
							console.log("INFO: ".green + path + "/" + className + " contained an error while compiling");
							var out = {error : stderr };
							send(out);
						}
						else {
							console.log("INFO: ".green + "compiled a java file");
                            const start = process.hrtime();
							exec(execute , function(error, stdout, stderr) {
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
                                    const time = utils.getPerformance(start);
									console.log('INFO: '.green + path + '/' + className + '.java successfully compiled and executed !');
									let out = { success : stdout, time: time };
									send(out);
								}
							});
						}
					});
			    }
			});
		}
	});
}
