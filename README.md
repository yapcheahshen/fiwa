# fiwa 符示織網
Forth Inspired WebAssembler 

## 緣起
- WebAssembly 實現了二元碼層級的跨平台，應用很廣，值得研究。
- 考察了現有幾個Forth 實作，要用到 C++/Rust/Python這些複雜的工具，相當麻煩。
- WebAssembly 基於堆疊式的虛擬機，和 Forth 是天作之合。

## 目標
- 讓 Forther 快速掌握 WebAssembly 的原理。
- 讓 Forth 起到類似 wat 的功用，但更為簡潔，可以直接用來開發。(用 wat 寫相當痛苦)
- 每隻程式控制在100行左右。

## 架構
- CodeGen 以 TypeScript寫就，負責生成 WebAssembly 目的碼。(編成index.js)
- Assembly 剖析 類Forth 代碼，轉WebAssebmly 語法。 (編成index.js)
- index.html 設置環境，並載入 forth corewords及用戶代碼，每次互動都是重新編譯再執行。

## 開發與執行
- 初階：打開 dist/index.html。只須略懂Forth ，不必懂 Javascript。
- 中階：打開 DevTool，學習單步除錯，穿梭 V8 和 WebAssembly 世界，在DevTools 的源代碼看到 8 個hex 的檔名，就是編好的 ，WebAssemblyText，語法是LISP血統的 S 語言。
- 高階：安裝 esbuild (推薦) ，執行 dev.cmd ，或 node run dev ，修改 TypeScript 。

## 與傳統Forth差異
- 無直譯模式
- 將近似Forth 的代碼編譯成 原生目的碼(wasm)
- 只是一個Assembler，沒有任何優化處理。
- 需要優化請過一遍 Binaryen 等有能力處理 AST 的高級工具。
- 使用 WebAssembly 原生虛擬機，只能部份操作Datastack，不能操作 Return Stack 和 Instruction Pointer。

## folders
src/      typescript 源代碼
dist/    手寫和 esbuild 產生的 js


## 已完成


## 未完成
