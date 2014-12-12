var _u = require('underscore');
var _mut = require('./my_util');
var _s = require('./scenario');

module.exports = {
    'dumpScenario' : dump,
};

function dump(){
    var scnarioObj = _s.getScenario();
    var nameList = _s.getListBlockName();
    
    _u.each(nameList,function(name){
	var list = scnarioObj[name]; 
	_mut.println(name + ':{');
	_u.each(list,function(c){
	    if (_mut.isString(c)){
		_mut.println('  "'+c+'"');
	    }else{
		_mut.println('  ['+c.name+']');
	    }
	});
	_mut.println('}');
    });
}

