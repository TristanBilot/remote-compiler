const express = require('express');
const path = require('path');
const app = express();
app.use(express.urlencoded());
app.use("/public", express.static(__dirname + "/public"));

const compiler = require('./compiler');
compiler.init({stats : true});

app.get('/' , function (req , res ) {
	res.sendfile( __dirname + "/public/index.html");
});

const PORT = 8080;
const timeout = {timeout: 20000};
const timeout_error = "The execution of your code timed out (" + timeout.timeout / 1000 + "s).";

app.post('/compilecode' , function (req , res ) {

	let code = req.body.code;
	let input = req.body.input;
    let inputRadio = req.body.inputRadio;
    let lang = req.body.lang;

	let callback = (data) => {
		console.log(data);
		if 		(data.error)   res.send({state: 'error', response: data.error});
		else if (data.success) res.send({state: 'success', response: data.success});
		else if (data.timeout) res.send({state: 'timeout', response: timeout_error});
		else ERR('[-] No data sent to the client');
	}

	switch (lang) {
		case "C":
			return compiler.compileCPP({cmd: "gcc", timeout: 10000}, code, callback);
		case "C++":
			return compiler.compileCPP({cmd: "g++", timeout: 10000}, code, callback);
		case "Java":
			return compiler.compileJava(timeout, code, callback);
		case "Python":
			return compiler.compilePython(timeout, code, callback);
		case "CS":
			return compiler.compileCS(timeout, code, callback);
		case "VB":
			return compiler.compileVB(timeout, code, callback);
		default:
			return console.log("Invalid language".red);
	}
});

app.get('/fullStat' , function(req , res ){
    compiler.fullStat(function(data){
        res.send(data);
    });
});

app.listen(PORT);
