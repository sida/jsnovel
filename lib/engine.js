// engine

var my = require('./my_util');

module.exports = {
    'create' : create,
};

function create(scriptObj){
    var code = scriptObj['code'];
    var labelIdx = scriptObj['idx'];
    var scriptCounter = 0;
    if ('start' in labelIdx){
	scriptCounter = labelIdx['start'];
    }
    return {
	'code':code,
	'labelIdx':labelIdx,
	'scriptCounter':scriptCounter,
	'varFrame' : {},  // 変数を保存するハッシュ。キーが変数名になる
	'step':step,
    };
}

function step(){
    if (this.code.length <= this.scriptCounter){return false;}
    var c = this.code[this.scriptCounter];
    var command = c['command'];
    var arg = c['arg'];
    this.scriptCounter++;

    switch(command){
    case "'": // print
	my.println('> ' + arg);
	break;
    case ':': // label
	break;
    case 'l': // let
	statmentLet(this.varFrame,arg);
	break;
    case 'g': // goto
	this.scriptCounter = this.labelIdx[arg];
	break;
    case 'i': // if
	var retStif = statmentIf(this,this.varFrame,arg);
	break;
    case 'e': // end
	return false;
    default:
	// エラー
	break;
    }
    return true;
}

function statmentIf(thisObj,v,arg){
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

    var retExp = compareExpress(v,exp);
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
	thisObj.scriptCounter = thisObj.labelIdx[labelOrExp];
	return true;
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

// 比較式
function compareExpress(v,str){
    var reg = /^([^<>=]+)\s*(=|<|>|<=|>=|<>)\s*([^<>=]+)/;
    var listExpress = reg.exec(str);
    if (listExpress==null){return null;}

    var leftExpress = evalExpress(v,listExpress[1]);
    var compareExpress = listExpress[2];
    var rightExpress = evalExpress(v,listExpress[3]);

    switch (compareExpress){
    case '=':
	return (leftExpress==rightExpress);
    case '<':
	return (leftExpress < rightExpress);
    case '>':
	return (leftExpress > rightExpress);
    case '<=':
	return (leftExpress <= rightExpress);
    case '>=':
	return (leftExpress >= rightExpress);
    case '<>':
	return (leftExpress != rightExpress);
    }
    return null;
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
