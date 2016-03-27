
var toPro = function(...argus) {
    return new Promise(function(resolve, reject) {
        var func = argus.pop();
        argus.push(function(...arg) {
            resolve(arg);
        });
        func.apply(this, argus);
    });
}

module.exports = toPro;