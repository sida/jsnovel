var _u = require('underscore');
var _my = require('./lib/my_util');

var ps = require('./lib/ps');

// ファイルリーダーの生成
var gm = ps.create();
gm.setFile('test.dat');


/*
・文字表示(')
 'xxxxx

・ラベル(:)
 :LABELNAME

・行移動(g)
 goto LABELNAME

・変数代入(s)
 

*/

function chkcomPrint(inp){
    var com = inp.substr(0,1);
    if (com!="'"){return null;}
    var arg = inp.substr(1);
    return {"'":arg};
}

function chkcomLabel(inp){
    var com = inp.substr(0,1);
    if (com!=":"){return null;}
    var labelname = inp.substr(1);
    return {':':labelname};
}

function chkcomGoto(inp){
    var com = inp.substr(0,4);
    if (com!='goto'){return null;}
    var splitline = inp.split(/\s+/);
    if (splitline.length != 2){return 'Syntax Error';}
    return {'goto':splitline[1]};
}

function noSupport(){
    return 'No Support Command';
}


var listCommandCheckFunc = [chkcomPrint,chkcomLabel,chkcomGoto,noSupport];
var origline;
var compiled = [];
var labelidx = {};
var lineNo = 1;
var effectiveLineNo = 0;

L1:while (null!=(origline = gm.readLn())){
    var ltmp = origline.replace(/^\s+/g, ''); // 先頭空白削除
    var l = ltmp.replace(/#.*/g, ''); // コメント削除
    for (var ii=0;ii<listCommandCheckFunc.length;ii++){
	if (l.length==0){break;}
	var r = listCommandCheckFunc[ii](l);
	if (r==null) {continue;}
	else if (_my.isString(r)){
	    _my.println(r + ' : line number ' + lineNo);
	    _my.println('> ' + l);
	    break L1;
	}
	else{
	    compiled.push(r);
	    if (typeof r[':'] !== 'undefined'){
		labelidx[r[':']] = effectiveLineNo;
	    }
	    effectiveLineNo++;
	    break;
	}
    }
    lineNo++;
}

_my.println(JSON.stringify(labelidx));
_my.println(JSON.stringify(compiled));

_my.println(compiled.length);
