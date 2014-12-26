var _u = require('underscore');
var _my = require('./lib/my_util');

var cmp = require('./lib/compile');

var ret = cmp.compile('test.dat');

_my.println(JSON.stringify(ret));

