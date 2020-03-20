const NS_TO_MS = 1e6;

exports.getPerformance = function(start) {
    const time = process.hrtime(start);
    const sec = time[0];
    const ns = time[1];

    if (sec > 0)
        return (sec + "." + Math.floor(ns / NS_TO_MS) + "s");
    return (ns / NS_TO_MS).toFixed(3) + "ms";
}
