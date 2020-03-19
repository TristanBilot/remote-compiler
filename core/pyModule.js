var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');

exports.compilePython = function (envData , code , fn) {

	const filename = cuid.slug();
	const path = './temp/';
	const execute = 'python ' + path + filename +'.py';

	fs.writeFile( path  +  filename +'.py' , code  , function(err ){
		if(err)
			console.log('ERROR: '.red + err);
	    else {
	    	console.log('INFO: '.green + filename +'.py created');
			exec( execute , function ( error , stdout , stderr ) {
				if(error) {
					if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
						var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
						fn(out);
					}
					else {
						console.log('INFO: '.green + filename + '.py contained an error while executing');
						var out = { error : stderr };
						fn(out);
					}
				}
				else {
					console.log('INFO: '.green + filename + '.py successfully executed !');
					var out = { success : stdout};
					fn(out);
				}
		    });
		}
	});
}
