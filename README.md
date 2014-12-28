jsnovel  
=======  
javascriptのノベルゲームエンジンのようなもの試作中。  
nodejs使うよ。

# ファイル
.
├── README.md
├── lib
│   ├── compile.js
│   ├── engine.js
│   ├── filereader.js
│   └── my_util.js
├── test.dat
├── test_compile.js
└── test_exec.js


compile.js : コードを読んで中間言語のようなオブジェクトに変換
engine.js : 中間言語のようなオブジェクトを受け取って実行するエンジン部分
filereader.js : ファイルリーダー。ファイルを全部読み込んで１行ごと渡す。
my_util.js : 表示用の補助

test.dat : ノベルゲームスクリプト
test_compile.js : コンパイラのようなものの動作確認
test_exec.js : エンジン部分の動作確認

# 仕様

## 変数
整数型のみ。名前は先頭がアルファベットで２文字目からは数字も可。

## 代入式
a=10
b=a+3
のようなもののみ可能。
括弧は使えない。
b=1+2+3
は不可。
演算子は、+,-,*,/,%(剰余)が使用可能。

## 条件式
左辺、右辺とも代入式と同じ制限がある。
比較用の演算子は=,>,<,=>,=<,<>

a = b
a < b
a+2 <= b+4
以下は使えない
a+b+1=10
a+b=c+d+e

## ステートメント
|ステートメント|機能|
|'{string}|あとに続く{string}を表示|
|:{labelname}|{labelname}というラベルを定義|
|#|#から行末までコメント|
|goto {labelname}|ラベル{labelname}へ処理を移動|
|let {代入式}|代入。値は２つと演算子１つまで　ex. a=a+10|
|if {条件式} then {代入式}|条件式 ex. a+1=b+3|
|if {条件式} goto {labelname}|条件式を満たしたら{labelname}へ移動|