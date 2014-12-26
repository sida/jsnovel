var _my = require('./my_util');
var ps = require('./ps');


module.exports = {
    'compile' : compile ,
};

function compile(filename){
    // ファイルリーダーの生成
    var reader = ps.create();
    reader.setFile(filename);
    return _compile(reader);
}


var listCommandCheckFunc = [chkcomPrint,chkcomLabel,chkcomGoto,noSupport];

function chkcomPrint(inp){
    var com = inp.substr(0,1);
    if (com!="'"){return null;}
    var arg = inp.substr(1);
    return {'command':"'",'arg':arg};
}

function chkcomLabel(inp){
    var com = inp.substr(0,1);
    if (com!=":"){return null;}
    var labelname = inp.substr(1);
    return {'command':':','arg':labelname};
}

function chkcomGoto(inp){
    var com = inp.substr(0,4);
    if (com!='goto'){return null;}
    var splitline = inp.split(/\s+/);
    if (splitline.length != 2){return 'Syntax Error';}
    return {'command':'g', 'arg':splitline[1]};
}

function noSupport(){
    return 'No Support Command';
}

function _compile(fileReader){
    var origline;
    var compiled = [];
    var labelidx = {};
    // エラー表示用のソースの行数
    var lineNo = 1;
    // コメントや空行をスキップした配列用のインデックス
    var effectiveLineNo = 0;

    while (null!=(origline = fileReader.readLn())){
	var ltmp = origline.replace(/^\s+/g, ''); // 先頭空白削除
	var l = ltmp.replace(/#.*/g, ''); // コメント削除
	for (var ii=0;ii<listCommandCheckFunc.length;ii++){
	    if (l.length==0){break;}
	    var r = listCommandCheckFunc[ii](l);
	    if (r==null) {continue;}
	    else if (_my.isString(r)){
		// エラー表示
		_my.println(r + ' : line number ' + lineNo);
		_my.println('> ' + origline);
		return null;
	    }
	    else{
		compiled.push(r);
		if (r['command'] == ':'){
		    labelidx[r['arg']] = effectiveLineNo;
		}
		effectiveLineNo++;
		break;
	    }
	}
	lineNo++;
    }
    return {'code':compiled,'idx':labelidx};
}
