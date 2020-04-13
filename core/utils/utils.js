const exec  = require('child_process').exec;

const NS_TO_MS = 1e6;

global.getPerformance = function(start) {
    const time = process.hrtime(start);
    const sec = time[0];
    const ns = time[1];

    if (sec > 0)
        return (sec + "." + Math.floor(ns / NS_TO_MS) + "s");
    return (ns / NS_TO_MS).toFixed(3) + "ms";
}

global.INFO = function(log) {
    let date = new Date();
    time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log('INFO @ $t : '.replace('$t',time).green + log);
}

global.WARN = function(log) {
    console.log('WARNING: '.yellow + log);
}

global.ERR = function(log) {
    console.log('ERROR: '.red + log);
}

global.errorManager = function(file, err, stderr, send, stdout) {
    var errExists = false;
    if (err) {
        if (stderr)
            ERR(file + " " + stderr);
        errExists = true;
    }
    if (stderr) {
        if (!err)
            ERR(file + " " + stderr);
        if (stderr.search('assert') != -1 ||
            stderr.search('Assertion') != -1 ||  // cpp, c
            stderr.search('java.lang.RuntimeException') != -1)        // Java
            send({ stdout: stdout, error : 'A hidden test failed !' });
        else
            send({ error : stderr });
        errExists = true;
    }
    return errExists;
}

global.processKiller = function(notFinished, timeout, send, lang, filename) {
    var processName;
    switch (lang) {
        case 'C':
        case 'C++':
            processName = './' + filename;
            break;
        case 'Python':
            processName = filename;
            break;
        case 'Java':
            // processName = '\'/bin/sh -c cd ' + filename + ' && java Algorithm\'';
            processName = '\'/usr/bin/java Algorithm\''; /* kill all the Java programs running !!! Need edit later */
            break;
        case 'Swift':
            processName = '/Applications/Xcode.app/Contents/Developer/Toolchains/*';
            break;
        default: 
            return WARN('Process killer unkokwn lang!');
    }
    setTimeout(function() {
        if (notFinished) {
            exec("kill $(ps aux | grep " + processName + " | awk '{print $2}')", { timeout: timeout },
                function(err, stdout, stderr) {
                if (err)
                    ERR(filename + ' failed to be killed after ' + timeout + 'ms.');
                else
                    WARN(filename ? filename : 'program' + ' was killed after ' + timeout + 'ms.' + ' (' + lang + ')');
                return send({ timeout : true });
            });
        }
        return;
    }, timeout);
}

global.err_infinite_loop = 'You might have initialized an infinite loop.';
global.err_compiling = ' contained an error while compiling.';
global.err_executing = ' contained an error while executing.';

global.succ_compiling = ' successfully compiled.'
global.succ_executing = ' successfully executed.'
