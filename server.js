const express = require('express');
const path = require('path');
const app = express();
app.use(express.urlencoded());

const compiler = require('./compiler');
compiler.init({stats : true});

app.get('/' , function (req , res ) {
	res.sendfile( __dirname + "/index.html");
});

const PORT = 8080;
const timeout = {timeout: 20000}

app.post('/compilecode' , function (req , res ) {

	let code = req.body.code;
	let input = req.body.input;
    let inputRadio = req.body.inputRadio;
    let lang = req.body.lang;

	var callback = function(data) {
		if (data.error) res.send(data.error);
		else res.send(data.output);
	}

	switch (lang) {
		case "C":
			return compiler.compileCPP({cmd: "gcc", timeout: 20000}, code, callback);
		case "C++":
			return compiler.compileCPP({cmd: "g++", timeout: 20000}, code, callback);
		case "Java":
			return compiler.compileJava(timeout, code, callback);
		case "Python":
			return compiler.compilePython(timeout, code, callback);
		case "CS":
			return compiler.compileCS(timeout, code, callback);
		case "VB":
			return compiler.compileVB(timeout, code, callback);
		default:
			console.log("Invalid language".red);
			return;
	}
});

app.get('/fullStat' , function(req , res ){
    compiler.fullStat(function(data){
        res.send(data);
    });
});

app.listen(PORT);
