var _u = require('underscore');
var _mut = require('./my_util');

var gSCENARIO = {_block_name:'',_line_counter:0,};

module.exports = {
    'next' : next,
    'add' : add,
    'clear' : clear,
    'overWrite' : overWrite,
    'remove' : remove,
    'getScenario' : function(){return gSCENARIO;},
    'getListBlockName' : nameList,
    'goto' : goto,
    'readString' : read,
};

function next(){
    var block = gSCENARIO["_block_name"];
    var line = gSCENARIO["_line_counter"];

    var commandObj = block[line];
    line++;
    if (block.length<=line){
	gSCENARIO["_block_name"] = getNextBlockName(name);
	gSCENARIO["_line_counter"] = 0;
    }
    return commandObj;
}

function getNextBlockName(name){
    var nameList = Object.keys(gSCENARIO);
    nameList.sort();
    var idx = nameList.indexOf(name);
    idx++;
    if (nameList.length<=idx){idx=0;}
    return nameList[idx];
}

function add(name,commandList){
    if (name in gSCENARIO){
	return false;
    }
    gSCENARIO[name] = commandList;
    return true;
}

function clear(){
    gSCENARIO = {
	'_block_name':'',
	'_line_counter':0,
    };
    return true;
}

function overWrite(name,commandList){
    gSCENARIO[name] = commandList;
    return true;
}

function remove(name){
    delete(gSCENARIO[name]);
    return true;
}

function _goto (name){
    if (!(name in gSCENARIO)){
	return false;
    }
    gSCENARIO["_block_name"] = name;
    return true;
}

function nameList (){
    var nameList = Object.keys(gSCENARIO);
    nameList.sort();
    var ret = [];
    for (var ii=0;ii<nameList.length;ii++){
	if ('_' != nameList[ii].substr(0,1)){
	    ret.push(nameList[ii]);
	}
    }
    return ret;    
}

function read (strScenario){
    eval(strScenario);
}


// シナリオ定義のDSL
function BLOCK(){
    if (arguments.length<2){
        _mut.println("Err:not enoght argments");
	return;
    }
    var arg = [];
    for (var ii=0;ii<arguments.length;ii++){
	arg[ii] = arguments[ii];
    }
    var name = arg.shift();

    var retState = add(name,arg);
    if (!retState) {
	_mut.println('err add block');
	return;
    }
}

function OVERWRITE_BLOCK(){
    if (arguments.length<2){
        _mut.println("Err:not enoght argments");
	return;
    }
    var arg = [];
    for (var ii=0;ii<arguments.length;ii++){
	arg[ii] = arguments[ii];
    }
    var name = arg.shift();
    var retState = overWrite(name,arg);
    if (!retState) {
	_mut.println('err over write block');
	return;
    }
}

function REMOVE_BLOCK(name){
    var retState = remove(name);
    if (!retState) {
	_mut.println('err remove block');
	return;
    }
}

// DSLのコマンド定義
var cr = {name:'cr',exec : function(){_mut.println('');}};

var goto = function(bname){
    var blockNmae = bname;
    return {
	'name' : 'goto->' + blockNmae,
	'exec' : function(){ _goto(blockname);},
    };
};
