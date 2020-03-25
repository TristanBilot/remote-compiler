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

global.errorManager = function(file, err, stderr, send) {
    var errExists = false;
    if (err) {
        ERR(file + " " + stderr);
        errExists = true;
    }
    if (stderr) {
        if (!err)
            ERR(file + " " + stderr);
        send({ error : stderr });
        errExists = true;
    }
    return errExists;
}

global.err_infinite_loop = 'You might have initialized an infinite loop.';
global.err_compiling = ' contained an error while compiling.';
global.err_executing = ' contained an error while executing.';

global.succ_compiling = ' successfully compiled.'
global.succ_executing = ' successfully executed.'
