# fiwa 符示織網
Forth Inspired WebAssembler 

## 緣起
- WebAssembly 實現了二元碼層級的跨平台，應用很廣，值得研究。
- 考察了現有幾個Forth 實作，要用到 C++/Rust/Python這些複雜的工具，相當麻煩。
- WebAssembly 基於堆疊式的虛擬機，和 Forth 是天作之合。

## 目標
- 讓 Forther 快速掌握 WebAssembly 的原理。
- Minimum Metacompiling。

## 架構
1. Assembler in Javascript
- 利用前端強大的環境(DevTools)，以及無所不在的滲透力。
- 每次修改Source code 都是重新編譯再執行，實現交談式開發。
- 生成一個含有wasm 模組。

2. 元編譯 MetaCompiling
- 在Browser環境成功自我編譯。
- 脫離Browser ，用 Wasm runtime (wasmer, wasmtime) 自我編譯。

## Assembler 架構
- 將輸入剖成token
- token 第一字元決定類似，依序為 : ; localvar , global var , defined words, numeric literal
- compile state 只有 inside 和 outside colon 的差別

## 開發與執行
- 初階：打開 dist/index.html。只須略懂Forth ，不必懂 Javascript。
- 中階：打開 DevTool，學習單步除錯，穿梭 V8 和 WebAssembly 世界，在DevTools 的源代碼看到 8 個hex 的檔名，就是編好的 ，WebAssemblyText，語法是LISP血統的 S 語言。
- 高階：修改Forth 程式，實作 Metacompiling。

## 與傳統Forth差異
- 無直譯模式，
- Object Code(Dictionary) 和 Data 分離，Data 區不能自由地放指令 (只能載入constant)
- 將近似Forth 的代碼編譯成 原生目的碼(wasm)
- 只是一個Assembler，沒有任何優化處理。
- 需要優化請過一遍 Binaryen 等有能力處理 AST 的高級工具。
- 使用 WebAssembly 原生虛擬機，只能部份操作Datastack (有drop指令，但沒有swap, dup，over等，官方建議是用參數) ，不能操作 Return Stack 和 Instruction Pointer。

## folders
src/      typescript 源代碼
dist/    手寫和 esbuild 產生的 js


## 已完成


## 未完成
