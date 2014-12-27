var _my = require('./my_util');
var ps = require('./ps');


module.exports = {
    'compile' : compile ,
};

function compile(filename){
    // ファイルリーダーの生成
    var reader = ps.create();
    reader.setFile(filename);
    // コンパイル
    return _compile(reader);
}

var commandListSpecial = {
    "'":"'",
    ':':':',
};

var commandListNormal = {
    'goto':'g',
    'let':'l',
    'if':'i',
    'end':'e',
};

function _compile(fileReader){
    var origline;
    var compiled = [];
    var labelidx = {};
    // エラー表示用のソースの行数
    var lineNo = 0;
    // コメントや空行をスキップした配列用のインデックス
    var effectiveLineNo = 0;

    while (null!=(origline = fileReader.readLn())){
	lineNo++;
	var ltmp = origline.replace(/^\s+/g, ''); // 先頭空白削除
	var l = ltmp.replace(/#.*/g, ''); // コメント削除
	if (l.length==0) {continue;}

	var commObj = parseCommand(l);
	if (commObj.command=='err'){
	    // エラー表示
	    _my.println(commObj.arg + ' : line number ' + lineNo);
	    _my.println('> ' + origline);
	    return null;
	}
	compiled.push(commObj);
	if (commObj.command == ':'){
	    labelidx[commObj.arg] = effectiveLineNo;
	}
	effectiveLineNo++;
    }
    return {'code':compiled,'idx':labelidx};
}

function parseCommand(lineStr){
    var commObj = matchSpecial(lineStr);
    if (commObj!=null){
	return commObj;
    }
    commObj = matchNormal(lineStr);
    if (commObj!=null){
	return commObj;
    }
    return {'command':'err', 'arg':'Syntax error'};   
}

function matchNormal(line){
    var reg = /^([a-zA-Z]+)\s+(.+)/i;
    var regNoArg = /^([a-zA-Z]+)\s*/i;
    var tmpList = reg.exec(line);
    var commStr = '';
    var code = '';
    var arg = '';
    if (tmpList==null){
	tmpList = regNoArg.exec(line);
	if (tmpList==null){return null;}
	commStr = tmpList[1];
	if (commStr in commandListNormal){
	    code = commandListNormal[commStr];
	    return {'command':code, 'arg':null};
	}
	return null;
    }
    else{
	commStr = tmpList[1];
	if (commStr in commandListNormal){
	    arg = tmpList[2];
	    code = commandListNormal[commStr];
	    return {'command':code, 'arg':arg};
	}
    }
    return null;
}

function matchSpecial(line){
    var commStr = line.substr(0,1);
    if (commStr in commandListSpecial){
	var code = commandListSpecial[commStr];
	var arg = line.substr(1);
	return {'command':code, 'arg':arg};
    }
    return null;
}
