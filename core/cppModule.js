var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');
var colors = require('colors');

path = './temp/';

exports.compileCPP = function ( envData ,  code , fn ) {
	//creating source file
	var filename = cuid.slug();

	fs.writeFile(path + filename +'.cpp', code, function(err) {
			if(err)
				console.log('ERROR: '.red + err);
			else
			{
				console.log('INFO: '.green + filename +'.cpp created');
				if(envData.cmd === 'g++')
				{
					/* COMPILATION */
					var commmand = 'g++ ' + path + filename +'.cpp -o '+ path + filename;
					exec(commmand, function(error, stdout, stderr){
						if(error)
						{
							console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
							var out = { error : stderr };
							fn(out);
						}
						else
						{
							var progNotFinished = true;
							commmand = "cd temp && ./" + filename;
							exec(commmand, function(error, stdout, stderr){
								if(error)
								{
									if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
									{
										var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
										fn(out);
									}
									else
									{
										console.log(tempcommand);
										console.log('INFO: '.green + filename + '.cpp contained an error while executing');

										var out = { error : stderr };
										fn(out);
									}
								}
								else
								{
									if(progNotFinished) {
										progNotFinished = false;// programme finished
										console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
										var out = { output : stdout};
										fn(out);
									}
								}
							});
							if(envData.options.timeout)
							{
								// kill the programme after envData.options.timeout ms
								setTimeout(function (){
									exec("taskkill /im "+filename+" /f > nul",function( error , stdout , stderr ){
										if(progNotFinished)
										{
											progNotFinished = false;// programme finished
											console.log('INFO: '.green + filename + ' was killed after '+ envData.options.timeout + 'ms');
											var out = { timeout : true};
											fn(out);
										}
									});
								},envData.options.timeout);
							}
						}
					});


				}
				else if(envData.cmd === 'gcc')
				{
					//compile c code
					commmand = 'gcc ' + path + filename +'.cpp -o '+ path + filename+'.out' ;
					exec(commmand , function ( error , stdout , stderr ){
						if(error)
						{
							console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
							var out = { error : stderr};
							fn(out);
						}
						else
						{
							exec( path + filename + '.out', function ( error , stdout , stderr ){
								if(error)
								{
									if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
									{
										var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
										fn(out);
									}
									else
									{
										console.log('INFO: '.green + filename + '.cpp contained an error while executing');
										var out = { error : stderr };
										fn(out);
									}
								}
								else
								{
									console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
									var out = { output : stdout};
									fn(out);
								}
							});
						}
					});
				}
				else
				{
					console.log('ERROR: '.red + 'choose either g++ or gcc ');
				}
			}	//end of else part of err
	}); //end of write file


} //end of compileCPP

exports.compileCPPWithInput = function ( envData , code , input ,  fn ) {
	var filename = cuid.slug();
	path = './temp/';

	//create temp0
	fs.writeFile( path  +  filename +'.cpp' , code  , function(err ){
			if(err)
				console.log('ERROR: '.red + err);
			else
			{
				console.log('INFO: '.green + filename +'.cpp created');
				if(envData.cmd ==='g++')
				{

					//compile c code
					commmand = 'g++ ' + path + filename +'.cpp -o '+ path + filename;
					exec(commmand , function ( error , stdout , stderr ){
						if(error)
						{
							console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
							var out = { error : stderr };
							fn(out);
						}
						else
						{
							if(input){
								var inputfile = filename + 'input.txt';

								fs.writeFile( path  +  inputfile , input  , function(err ){
									if(err)
										console.log('ERROR: '.red + err);
									else
										console.log('INFO: '.green + inputfile +' (inputfile) created');
								});
								var progNotFinished=true;
								var tempcommand = "cd temp & " + filename ;

								exec( tempcommand + '<' + inputfile , function( error , stdout , stderr ){
									if(error)
									{
										if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
										{
											var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'};
											fn(out);
										}
										else
										{
											console.log('INFO: '.green + filename + '.cpp contained an error while executing');
											var out = { error : stderr};
											fn(out);
										}
									}
									else
									{
										if(progNotFinished) {
											progNotFinished = false;
											console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
											var out = {output: stdout};
											fn(out);
										}
									}
								});
								if(envData.options.timeout)
								{
									// kill the programme after envData.options.timeout ms
									setTimeout(function (){
										exec("taskkill /im "+filename+" /f > nul",function( error , stdout , stderr ){
											if(progNotFinished)
											{
												progNotFinished=false;// programme finished
												console.log('INFO: '.green + filename + ' was killed after '+envData.options.timeout+'ms');
												var out = { timeout : true};
												fn(out);
											}
										});
									},envData.options.timeout);
								}

							}
							else //input not provided
							{
								console.log('INFO: '.green + 'Input mission for '+filename +'.cpp');
								var out = { error : 'Input Missing' };
								fn(out);
							}
						}
					});
				}
				else if ( envData.cmd == 'gcc')
				{
					//compile c code
					commmand = 'gcc ' + path + filename +'.cpp -o '+ path + filename+'.out' ;
					exec(commmand , function ( error , stdout , stderr ){
						if(error)
						{
							console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
							var out = { error : stderr};
							fn(out);
						}
						else
						{
							if(input){
								var inputfile = filename + 'input.txt';

								fs.writeFile( path  +  inputfile , input  , function(err ){
										if(err)
											console.log('ERROR: '.red + err);
										else
											console.log('INFO: '.green + inputfile +' (inputfile) created');
								});

								exec( path + filename +'.out' + ' < ' + path + inputfile , function( error , stdout , stderr ){
									if(error)
									{

										if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
										{
											var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'};
											fn(out);
										}
										else
										{
											console.log('INFO: '.green + filename + '.cpp contained an error while executing');
											var out =  { output : stderr};
											fn(out);
										}
									}
									else
									{
										console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
										var out = { output : stdout};
										fn(out);
									}
								});
							}
							else //no input file
							{
								console.log('INFO: '.green + 'Input mission for '+filename +'.cpp');
								var out = { error : 'Input Missing' };
								fn(out);
							}
						}
					});
				}
				else
				{
					console.log('ERROR: '.red + 'choose either g++ or gcc ');
				}
			}	//end of else err
	});	//end of write file
} //end of compileCPPWithInput
