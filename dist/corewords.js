﻿/*
 以 : 和 ; 開頭的字有特殊意義：

 :名字      ，不能有空格
 ;export到js的名字，省略即不export

 名字之後緊接著的 ( ) 定義參數。（ 參數名 -- 返回值的個數 區域變數 )
 如果不指定 參數，預設是 (a -- 1)  進一出一
 只要不在: ; 之內的字，不會立刻執行，而是集中編入 _main (被多組 : ; 隔開，不影響目的碼)
 十六進位數字 以 0x 前綴
 :sq ( a -- 1 ) dup * ;square

 區域變數沒有 取址的操作 ，賦值在名字後加 !
 30 x!  將變數 x 的值設為 30

 WebAssembly 會嚴格檢查 進入和離開函式時的堆疊個數，如果和定義不同，將無法通過編譯。
 換言之，dup ( a -- 2 ) 只能看到 tos ，返回時必須在堆疊留下兩個值，不多不少。
*/

var corewords=`
\\ 註解到行末，在javascript 的template string 必須有兩個 
( 不在 : 之後的包夾註解，不可跨行 )
( 這裡最好只放 colon defination, 否則會被編入 _main )
:dup    ( a -- 2 ) a ;dup

`