var _u = require('underscore');
var my = require('./lib/my_util');

var cmp = require('./lib/compile');

var ret = cmp.compile('test.dat');

my.println(JSON.stringify(ret,null,'  '));

