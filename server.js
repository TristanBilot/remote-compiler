const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv/config');
const app = express();
require('./core/utils/utils');

app.use(express.urlencoded());
app.use("/public", express.static(__dirname + "/public"));
app.use(express.json());

const exercisesRoute = require('./routes/routes');
app.use('/exercises', exercisesRoute);

const compiler = require('./compiler');
compiler.init({stats : true});

app.get('/', function (req, res) {
	res.sendfile( __dirname + "/public/index.html");
});

const PORT = 8080;
const timeout = 10000;
const timeout_error = "The execution of your code timed out (" + timeout / 1000 + "seconds).";

app.post('/compilecode' , function (req , res ) {

	let code = req.body.code;
	let input = req.body.input;
    let inputRadio = req.body.inputRadio;
    let lang = req.body.lang;

	let callback = (data) => {
		console.log(data);
		if 		(data.error)   res.send({state: 'error', response: data.error, time: data.time});
		else if (data.success) res.send({state: 'success', response: data.success, time: data.time});
		else if (data.timeout) res.send({state: 'timeout', response: timeout_error, time: data.time});
		else if (data.error == '' || data.success == '' || data.timeout == '')
			res.send({state: 'success', response: ' ', time: data.time});
		else ERR('[-] No data sent to the client');
	}

	switch (lang) {
		case "C":
			return compiler.compileCPP({cmd: "gcc", timeout: timeout}, code, callback);
		case "C++":
			return compiler.compileCPP({cmd: "g++", timeout: timeout}, code, callback);
		case "Java":
			return compiler.compileJava({timeout: timeout}, code, callback);
		case "Python":
			return compiler.compilePython(timeout, code, callback);
		case "Swift":
			return compiler.compileSwift({timeout: timeout}, code, callback);
		case "Objective-C":
			return compiler.compileObjC({timeout: timeout}, code, callback);
		default:
			return ERR("Invalid language");
	}
});

app.listen(PORT);

compiler.stats();

mongoose.connect(process.env.DB_CONNECTION, {useUnifiedTopology: true}, () => {
    console.log('[ ok ] connected to database');
})
.then(() => {
    require('./database/methods/insert');
});
