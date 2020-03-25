const fs = require('fs');
require('colors');

const corePath = './core/';
const cppModule = require(corePath + 'CppCompiler.js');
const javaModule = require(corePath + 'JavaCompiler.js');
const swiftModule = require(corePath + 'SwiftCompiler.js');
const objCModule = require(corePath + 'ObjCCompiler.js');
const pyModule = require(corePath + 'PythonCompiler.js');

exports.init = function(option){
	fs.exists('./temp', function(exists) {
	    if(!exists) {
	        INFO('temp directory created for storing temporary files.'.cyan)
	    	fs.mkdirSync('./temp');
	    }
	});
}

exports.compileSwift = function(options, code, callback){
	swiftModule.compileSwift(options , code , callback );
}

exports.compileObjC = function(options, code, callback){
	objCModule.compileObjC(options , code , callback );
}

exports.compileCPP = function(options, code, callback){
	cppModule.compileCPP(options , code , callback );
}

exports.compileJava = function(options, code, callback){
	javaModule.compileJava(options, code, callback);
}

exports.compilePython = function(options, code, callback){
	pyModule.compilePython(options , code , callback );
}

exports.flushSync = function() {
    path = './temp/';
    fs.readdir(path, function(err, files){
    	if(!err)
    		for (let i = 0 ; i < files.length ; i++ )
    			fs.unlinkSync(path + files[i]);
    });
}

exports.flush = function(callback) {
    path = './temp/';
    fs.readdir(path, function(err , files){
    	if(!err)
    		for( var i = 0 ; i<files.length ; i++ )
    			fs.unlinkSync(path+files[i]);
    });
    callback();
}

exports.stats = function(callback){
	var uptime = process.uptime();

	var cppCount = 0;
	var javaCount = 0 ;
	var pyCount = 0 ;
	var exeCount = 0 ;
	var total = 0 ;

	var files = fs.readdirSync('temp');
	for(let file in files) {
		total++;
		var stat = fs.statSync('temp/'+files[file]);
		if(stat.isFile()) {
			if(files[file].indexOf('.cpp') !== -1)
				cppCount++;
			if(files[file].indexOf('.py') !== -1)
				pyCount++;
			if(files[file].indexOf('.') == -1)
				exeCount++;
		}
		else
			javaCount++;
	}

	var jsonData = {
		serverUptime : uptime,
		fileDetails : {
	 		cpp : cppCount,
			java : javaCount,
			python : pyCount
		}
	}
	const dash = '=> '.cyan;
	const y = (num) => { return num.toString().yellow; }
	const stats  = "\n ---- Server Statistics ----".cyan + "\n"
			+ dash + "Server Uptime : \t" + y(uptime)  + "\n"
			+ dash + "Files on storage :\t" + y(total) + "\n"
			+ dash + "C & C++ files : \t" + y(cppCount) + "\n"
			+ dash + "Binary files : \t" + y(exeCount) + "\n"
			+ dash + "Java files : \t" + y(javaCount) + "\n"
			+ dash + "Python files : \t"+ y(pyCount) + "\n" ;

	console.log(stats);
	if (callback)
		callback(jsonData);

}
