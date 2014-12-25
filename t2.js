var _u = require('underscore');
var _my = require('./lib/my_util');

var ps = require('./lib/ps');


var gm = ps.create();

gm.setFile('test.dat');

var l;
while (null!=(l = gm.readLn())){
    l.replace(/^\s+/g, "");
    if (l.indexOf("'")==0){}
    if (l.indexOf("'")==0){}

    _my.println(l);
}

    
