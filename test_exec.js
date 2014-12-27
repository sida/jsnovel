var _u = require('underscore');
var my = require('./lib/my_util');

var cmp = require('./lib/compile');

var ret = cmp.compile('test.dat');

my.println(JSON.stringify(ret));

// engine

var varFrame = {};// 変数を保存するハッシュ。キーが変数名になる。
var labelIdx = ret['idx'];
var code = ret['code'];

for (var ii=0;ii<code.length;ii++){
    var c = code[ii];
    var command = c['command'];
    var arg = c['arg'];

    switch(command){
    case "'": // print
	my.println('> ' + arg);
	break;
    case ':': // label
	break;
    case 'l': // let
	statmentLet(varFrame,arg);
	break;
    case 'g': // goto
	ii = labelIdx[arg];
	break;
    case 'i': // if
	var retStif = statmentIf(varFrame,arg);
	if (my.isString(retStif)){
	    ii = labelIdx[retStif];
	}
	break;
    default:
	break;
    }
}

my.println('a='+varFrame.a);
my.println('b='+varFrame.b);

function statmentIf(v,arg){
    var reg = /^\s*(.+)\s+(then|goto)\s+([a-zA-Z].+)/;
    var resList = reg.exec(arg);
    if (resList==null){
	//TODO エラー処理
	my.println('実行時エラー1' + arg);
	return false;
    }
    var exp = resList[1];
    var then = resList[2];
    var labelOrExp = resList[3];

    var retExp = equalExpress(v,exp);
    if (retExp==null){
	//TODO エラー処理
	my.println('実行時エラー3' + arg);
	return false;
    }
    if (!retExp){
	// 式は一致しなかった
	return true;
    }
    // 式が一致したのでthenの処理
    if (then=='then'){
	return statmentLet(v,labelOrExp);
    }
    else if (then=='goto'){
	return labelOrExp;
    }
    else{
	//TODO エラー処理
	my.println('実行時エラー2' + arg);
	return false;
    }
    return true;
}

function statmentLet(v,arg){
    var ret = substitutionExpress(v,arg);
    if (!ret){
	//TODO エラー処理
	my.println('ERROR Express:'+arg);
	return false;
    }
    return true;
}

//var regValue = /^\s*([a-zA-Z]\w*|[1-9][0-9]*)/;

// 代入式
function substitutionExpress(v,str){
    var listExpress = str.split('=');
    var tmpleft = listExpress[0];
    var leftExpress = tmpleft.replace(/\s+/g, "");
    if (/[a-zA-Z]\w*/.test(leftExpress)){
	var rightExpress = evalExpress(v,listExpress[1]);
	v[leftExpress] = rightExpress;
	return true;
    }
    else{
	// エラー
	return false;
    }
}

// 比較式
function equalExpress(v,str){
    var listExpress = str.split('=');

    var leftExpress = evalExpress(v,listExpress[0]);
    var rightExpress = evalExpress(v,listExpress[1]);
    return (leftExpress==rightExpress);
}

// 式の評価
function evalExpress(v,str){
    var rete = evalEx(v,str);
    if (rete==null){
	return evalVal(v,str);
    }
    return rete;    
}

// 式の評価　本体
function evalEx(v,str){
    var regExpress = /^\s*([a-zA-Z]\w*|[1-9][0-9]*)\s*([+-/*%])\s*([a-zA-Z]\w*|[1-9][0-9]*)/;
    var rete = regExpress.exec(str);
    if (rete==null){return null;}
    var val1 = evalVal(v,rete[1]);
    var exp =  rete[2];
    var val2 = evalVal(v,rete[3]);
    switch (exp){
    case '+':
	return val1 + val2;
    case '-':
	return val1 - val2;
    case '/':
	return val1 / val2;
    case '*':
	return val1 * val2;
    case '%':
	return val1 % val2;
    }
    return null;
}

// 値だけの式の評価
function evalVal(v,str){
    if (isNumericString(str)){
	return parseInt(str,10);
    }
    return v[str];
}

// 整数値として見れる文字列かどうかの判定
function isNumericString(str){
    var regn = /[1-9][0-9]*/;
    return regn.test(str);
}
