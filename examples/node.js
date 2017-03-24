var parseHocon = require('./../build/hoconjs');

var obj = '{ a: [1 2 3], b.c: hello }';
var parsedObj = parseHocon(obj);

console.log(JSON.stringify(parsedObj));
