var _my = require('./my_util');
var fs = require('fs');

// ファイル読み込み

module.exports = {
    create : _create,
};

function _create (){
    var o = {
	buffer : '',
	head : 0,
	setFile : _setFile,
	readLn : _readLn
    };
    return o;
}

function _setFile(filename){
    this.buff = fs.readFileSync(filename,'utf8');
}

function _readLn(){
    if (this.buff.length <= this.head){
	return null;
    }
    if (this.head == -1){
	return null;
    }

    var idxEOL = this.buff.indexOf("\n",this.head);
    var ret = '';
    if (0 > idxEOL){
	ret = this.buff.substr(this.head);
	this.head = -1;
	return ret;
    }
    ret = this.buff.substr(this.head, idxEOL - this.head);
    this.head = idxEOL + 1;
    return ret;
}
