var my = require('./lib/my_util');


var regExpress = /^\s*([a-zA-Z]\w*|[1-9][0-9]*)\s*([+-/*%])\s*([a-zA-Z]\w*|[1-9][0-9]*)/;
var regValue = /^\s*([a-zA-Z]\w*|[1-9][0-9]*)/;


var v = {'a':3,'bb':2};
var e1 = '100%11';
var e2 = 'a*5';
var e3 = 'bb+5';
var e4 = 'a+a';
var e5 = 'bb+a';

my.println(evalExpress(v,e1));
my.println(evalExpress(v,e2));
my.println(evalExpress(v,e3));
my.println(evalExpress(v,e4));
my.println(evalExpress(v,e5));


var e10 = '6=6';
var e11 = '6=5';
var e12 = 'a=bb';
var e13 = 'a+1=bb+2';

my.println(equalExpress(v,e10));
my.println(equalExpress(v,e11));
my.println(equalExpress(v,e12));
my.println(equalExpress(v,e13));


// 代入式
function substitutionExpress(v,str){
    var listExpress = str.split('=');
    var tmpleft = listExpress[0];
    var leftExpress = tmpleft.replace(/\s+/g, "");
    if (/[a-zA-Z]\w*/.test(leftExpress)){
	var rightExpress = evalExpress(v,listExpress[1]);
	v.leftExpress = rightExpress;
	return true;
    }
    else{
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
