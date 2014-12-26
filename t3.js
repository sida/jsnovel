var _u = require('underscore');
var my = require('./lib/my_util');

var cmp = require('./lib/compile');

var ret = cmp.compile('test.dat');

my.println(JSON.stringify(ret));

var labelIdx = ret['idx'];
var code = ret['code'];

for (var ii=0;ii<code.length;ii++){
    var c = code[ii];
    var command = c['command'];
    var arg = c['arg'];

    switch(command){
    case ':':
	break;
    case 'g':
	ii = labelIdx[arg];
	break;
    case "'":
	my.println('> ' + arg);
	break;
    default:
	break;
    }
}

