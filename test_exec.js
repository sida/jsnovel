var my = require('./lib/my_util');

var cmp = require('./lib/compile');
var eng = require('./lib/engine');

var codeObj = cmp.compile('test.dat');

my.println(JSON.stringify(codeObj));

var engObj = eng.create(codeObj);

while (engObj.step());

