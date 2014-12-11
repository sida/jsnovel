var _u = require('underscore');
var _mut = require('./my_util');


var gSCENARIO = {};

// util
function isArray(o){
  return o instanceof Array;
}

function  isString(o){
    return (typeof o == 'string');
}

// API
function log (mess){
    _mut.println(mess);
}

function println (mess){
    _mut.println(mess);
}

function print (mess){
    _mut.print(mess);
}

function dump(){
    _u.each(gSCENARIO,function(list,k){
	println(k + ':{');
	_u.each(list,function(c){
	    if (isString(c)){
		println('  "'+c+'"');
	    }else{
		println('  ['+c.name+']');
	    }
	});
	println('}');
    });
}

// DSL
var cr = {name:'cr',exec : function(){_mut.println('');}};

function BLOCK(){
    if (arguments.length<2){
        log("Err:not enoght argments");
	return;
    }
    var arg = [];
    for (var ii=0;ii<arguments.length;ii++){
	arg[ii] = arguments[ii];
    }
    var name = arg.shift();
    if (name in gSCENARIO){
        log("Err:exist block "+name);
	return;
    }
    gSCENARIO[name] = arg;
}

function OVERWRITE_BLOCK(){
    if (arguments.length<2){
        log("Err:not enoght argments");
	return;
    }
    var arg = [];
    for (var ii=0;ii<arguments.length;ii++){
	arg[ii] = arguments[ii];
    }
    var name = arg.shift();
    delete gSCENARIO[name];
    if (name in gSCENARIO){
        log("Err:exist block "+name);
	return;
    }
    gSCENARIO[name] = arg;
}

function REMOVE_BLOCK(name){
    delete gSCENARIO[name];
}

// DSL実行

BLOCK ('1','aaa','bbb',cr,cr);
BLOCK ('2','ccccc','dd',cr);

dump();

OVERWRITE_BLOCK ('name1',cr,'AA','BB');
dump();


//_mut.println_dump(gSCENARIO);
