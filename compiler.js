const exec  = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');
const colors = require('colors');

const corePath = './core/';
const cppModule = require(corePath + 'cppModule.js');
const javaModule = require(corePath + 'javaModule.js');
const swiftModule = require(corePath + 'SwiftCompiler.js');
const pyModule = require(corePath + 'pyModule.js');
const csModule = require(corePath + 'csModule.js');
const vbModule = require(corePath + 'vbModule.js');

exports.stats = false;

exports.init = function(option){
	if(option) {
		if(option.stats === true )
			exports.stats = true;
    }
	fs.exists('./temp', function(exists) {
	    if(!exists) {
	        if(exports.stats)
	        	console.log('INFO: '.cyan + 'temp directory created for storing temporary files.'.cyan )
	    	fs.mkdirSync('./temp');
	    }
	});
}

exports.compileSwift = function ( envData ,  code , callback ){
	if(exports.stats)
		swiftModule.stats = true;
	swiftModule.compileSwift(envData , code , callback );
}

exports.compileCPP = function ( envData ,  code , callback ){
	if(exports.stats)
		cppModule.stats = true;
	cppModule.compileCPP(envData , code , callback );
}

exports.compileCPPWithInput = function ( envData , code , input ,  callback ) {
	if(exports.stats)
		cppModule.stats = true;
	cppModule.compileCPPWithInput(envData , code , input , callback );
}


exports.compileJava = function ( envData , code , callback ){
	if(exports.stats)
		javaModule.stats = true;
	javaModule.compileJava(envData, code, callback);
}

exports.compileJavaWithInput = function ( envData , code , input ,  callback ){
	if(exports.stats)
		javaModule.stats = true;
	javaModule.compileJavaWithInput( envData , code , input ,  callback );
}

exports.compilePython = function ( envData ,  code , callback ){
	if(exports.stats)
		pyModule.stats = true;
	pyModule.compilePython(envData , code , callback );
}

exports.compilePythonWithInput = function( envData , code , input ,  callback){
	if(exports.stats)
		pyModule.stats = true;
	pyModule.compilePythonWithInput(envData , code , input , callback );

}

exports.compileCS = function ( envData ,  code , callback ){
	if(exports.stats)
		csModule.stats = true;
	csModule.compileCS(envData , code , callback );
}

exports.compileCSWithInput = function ( envData , code , input ,  callback ) {
	if(exports.stats)
		csModule.stats = true;
	csModule.compileCSWithInput(envData , code , input , callback );
}

exports.compileVB = function ( envData ,  code , callback ){
	if(exports.stats)
		vbModule.stats = true;
	vbModule.compileVB(envData , code , callback );
}

exports.compileVBWithInput = function ( envData , code , input ,  callback ) {
	if(exports.stats)
		vbModule.stats = true;
	vbModule.compileVBWithInput(envData , code , input , callback );
}

exports.flushSync = function() {
    path = './temp/';
    fs.readdir(path, function(err , files){
    	if(!err)
    		for( var i = 0 ; i<files.length ; i++ )
    			fs.unlinkSync(path+files[i]);
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

exports.fullStat = function(callback){
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
