var _s = require('./lib/scenario');
var _debug = require('./lib/debug_util');

g
// DSL実行
var command = 
"BLOCK ('b1','aaa','bbb',cr,cr)\n" +
"BLOCK ('b2','ccccc','dd',cr)\n" +
"OVERWRITE_BLOCK ('name1',cr,'AA','BB',goto('b1'))\n";
//"BLOCK ('m1','ccccc','dd',keyin(2,'mess1','mess2',goto('b1'),goto('b2')))\n";

_s.readString(command);
_debug.dumpScenario();
