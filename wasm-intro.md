# WebAssembly 入門

##網編 Wasm
WebAssembly 網路匯編，簡稱wasm，是一個棧式虛擬機指令集(Stack back virtual machine instruction set)，
網編的成功之處在於，從網頁這個長青架構汲取到的發展壯大的養份。
主流軟件大廠迫於，全球大量用戶對網頁程式的無止境要求，也將網編放進每一家的瀏覽器中。

網編可說瀏覽器有了Javascript之後，最重大的里程碑，Java, .NET 無法完成的夢想，
很有可能由網編實現，挾網頁的強大滲透力，wasm將會是第一個跨平台的二進位指令格式。

## 新的機會
由於Wasm相當低階，從wasm 到實際運行的芯片只有一層抽象化，
雖然設計之初是為了讓各種高階語言轉譯。
但我們可以拋開所有高階語言的包袱，（當代高階語言的開發環境動輒GB起算）
從指令集開始創造全新的編程語言。

## Wasm虛擬指令

指令按籌數(Operand)分有以下幾種：
雙籌運算：如加減乘除，二進制邏輯，賦值，比大小。會提取棧上兩個元素，在棧上留下一個或不留下結果。
單籌運算： set_local|global , drop, if ,abs eqz, ceil, floor 浮點計算
無籌運算：
  無參數的有：nop , unreachable, else, ret 等等

call , get|set_local|global, const 的參數已預先編入，
在載入的過程中連同指令一起載入到「唯讀」的指令區，不在內存也不在棧。




