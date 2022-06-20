/*
 以 : 和 ; 開頭的字有特殊意義：

 :名字      ，不能有空格。這個名字只在匯編階段看到，在wasm會換成序號。


 ;export到js的名字，省略即不export ，export name 比須是 /^[$A-Z_][0-9A-Z_$]*$/i

 名字之後緊接著的 ( ) 定義參數。（ 參數名 -- 返回值的個數 區域變數 )
 如果不指定 參數，預設是 (a -- 1)  進一出一
 只要不在: ; 之內的字，不會立刻執行，而是集中編入 _main (被多組 : ; 隔開，不影響目的碼)
 十六進位數字 以 0x 前綴
 :sq ( a -- 1 ) dup * ;square

 區域變數沒有 取址的操作 ，賦值在名字前加 = ( 同 Forth 的 TO x)
 30 =x  將變數 x 的值設為 30
 注意不是

 WebAssembly 會嚴格檢查 進入和離開函式時的堆疊個數，如果和定義不同，將無法通過編譯。
 換言之，dup ( a -- 2 ) 只能看到 tos ，返回時必須在堆疊留下兩個值，不多不少。

 
*/

var corewords=`
\\ 註解到行末，在javascript 的template string 必須有兩個 
( 不在 : 之後的包夾註解，不可跨行 )
( 這裡最好只放 colon defination, 否則會被編入 _start )

:dup  ( 1 -- 2 ) $0    ;                   \\ 用 $0 表示第一個參數(已在stack 上)
:!    ( x addr -- 0 ) addr x i32_store  ;  \\ 已命名的參數不會在stack 上
:swap ( a b -- 2 ) b a ;

\\ i32_store 地址/值 順序和Forth 相反，如果不想多付出6條指令和一個call 的代價，請用 i32_store
\\ :c! ( x addr ) drop drop addr x i32_store8_u ; \\ 
`