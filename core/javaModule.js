var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');



exports.stats = false ;

exports.compileJava = function (envData , code , fn ){

    const className = "Algorithm";
    const dirname = cuid.slug();
    const path = './temp/'+dirname;
    const compile = "cd " + path + " && javac " + className + ".java";
    const execute = "cd " + path + " && java " + className;


	fs.mkdir(path , 0777 , function(err){
		if(err && exports.stats)
		console.log(err.toString().red);
		else
		{
			fs.writeFile( path  + "/" + className + ".java" , code  , function(err ){
				if(err && exports.stats)
					console.log('ERROR: '.red + err);
			    else
			    {
			    	if(exports.stats)
			    		console.log('INFO: '.green + path + "/" + className + ".java created");

					exec(compile , function( error , stdout , stderr ){
						if(error)
						{
							if(exports.stats)
								console.log("INFO: ".green + path + "/" + className + " contained an error while compiling");
							var out = {error : stderr };
							fn(out);
						}
						else
						{
							console.log("INFO: ".green + "compiled a java file");
							exec(execute , function( error , stdout , stderr ){
								if(error)
								{
									if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
									{
										var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'};
										fn(out);
									}
									else
									{
										if(exports.stats)
										{
											console.log('INFO: '.green + path  + '/' + className +'.java contained an error while executing');
										}
										var out = { error : stderr};
										fn(out);
									}
								}
								else
								{
									if(exports.stats)
									{
										console.log('INFO: '.green + path + '/' + className + '.java successfully compiled and executed !');
									}
									var out = { success : stdout};
									fn(out);
								}
							});
						}
					});
			    }
			});
		}
	});
}
