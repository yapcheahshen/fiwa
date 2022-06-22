//compiled object code  用於code/function/instruction/指令/代碼 馬字部
// program                     程序/程序，人安排給電腦，令其按照規定的流程和順序運行。
// source code              騵 源代碼，人類手工編寫的代碼，騵將人的意圖準確表達給電腦知曉，是程序的詳細藍圖。
// a required/import module 駜 必要的引入模塊，缺少無法運行。
// instruction code         駖 令芯片執行動作的最基礎命令。
// function/macro           䮶 駖排列組合為䮶。
// export symbol            𩢎 給外界用的䮶。
// a module                 䮬 代碼模組，由多個䮶合成。一個能夠獨立運行的模塊，表現為一個 wasm 文件。
// code in text form        馼 the WAT   文字格式的䮬
// code in binary form      駁 the Wasm  二進位格式的䮬 與 馼 互為表裡
// codepoint                驒 編碼單元。
// test code                驗 確保程式行為符合預期的程序。
// running                  馳 正在執行的程序。
// tracing and debugging    䮱 已停下來，可以觀察的程序。

// 需資料參與、靜態的素材                資材料    貝字和米部、木部  𥹓 糆
// 和程序相關的結構、網絡、組織相關用絲字部   
// assemble                 織
// compiling                編
// bit   爻  位元，二進制
// i8    爼  位元組  𦵔帶正負值 
// i16   㸚  2的四次方 i16_s 
// i32   圭
// i64   卦 
// i32_s 洼  (有正負值的 signed 多 一點二點或三點  㤊 潒 廂）
// i64_s 褂   
// f32可以表達難數清的數值，借鳥毛義。的操作含鳥、隹 𪂼 䳏(32 bits floating含鳥隹)    f64糶 糴 𩮌 𦐰(64bits 帶羽彡旁) 毛更多了
// 記憶體  憶 
// 讀入圭    入
// 寫出圭    出
// 寫出卦    粜
// 讀入卦    籴
// f32𩿩鳰  f64糶糴

//instruction/function  table  𩤕
//interface       𩡺
//class           類別,           
//object          𩤩    對象/物件
//value           值    , value type 值型
//elem      
//string          𦀵
//function        䮶
//variable        變量
//const                     𥹚  常量
//reference 縿              指向一個物件或䮶
//value reference 值縿
//basic data type           㮌 
//data structure            糆
//parameter                 糝  (靜態的)做為䮶的輸入材料
//result type               粿  
//function reference        䮶縿       
//function types signature  緬 𫘏



//global    全域
//local     區域
//
//API       程𩡺
//constant  零進值出     圭   卦  䳏  𦐰 
//unary     一進值出     圭 洼-   卦 -褂   䳏  𦐰
//binary    二進值出     相32  湘32sign  厢64  廂(64sign)   𪂼(f32)  f64𩮌
//test      一進爻出     
//compare   二進爻出     同binary 用相
//轉換
//

先「立名」，找出所有名，但不織
//  絘 next
//駖集  䋂  爼
export const {
unreachable:"䌝", nop:"𦁈",block:["〈","綑"],loop:["《","絗"], if:["𦀌","？"], else:["緎","！"],end:["〉","》","終"],
br:"𥾣", br_if:"𢺽", br_table:"𥸳", return:"𥾵",
//1_
call:"紹", call_indirect:"𥹙", drop:"𥹓", select:"䊁",
local_get :"⑴...⒇",local_set:"①...⑳",local_tee:"⓵...⓾", global_get:"⒜...⒵", global_set:"ⓐ..ⓩ",
//2_
i32_load:    "入",   i64_load:    "籴" ,f32_load:      "鳰",       f64_load"糴",
i32_load8_s:"𦵔入",  i32_load8_u:"爼入",i32_load16_s:"泮入",i32_load16_u:"半入", 
//3_
i64_load8_s: "𦵔籴",i64_load8_u: "爼籴",i64_load16_s:"𠅫籴",i64_load16_u:"㸚籴",
i64.load32_s:"泮籴",i64.load32_u:"半籴",     i32_store:"出",     i64_store:"粜",
f32_store:     "𩿩",     f64_store:"糶",  i32_store8:"爼出", i32_store16:"半出",
i64_store8:  "爼粜", i64_store16:"㸚粜",  64_store32:"半粜", memory_size:"憶愹",
//4_
memory_grow:"憶脹", t32_const:"亘圭"    ,t64_const:"亘卦",   f32_const:"亘䳏",   f64_const:"亘𦐰",
i32_eqz:    "圭零", i32_eq:   "相同",  i32_ne:  "相異",  i32_lt_s:"湘小",  i32_lt_u:"相小",
i32_gt_s:   "湘大", i32_gt_u: "相大",  i32_le_s:"湘小同",i32_le_u:"相小同",i32_ge_s:"湘大同",i32_ge_u:"相大同",
//5_
i64_eqz: "卦零",  i64_eq:"厢同",i64_ne:  "厢異",  i64_lt_s:"廂小",  i64_lt_u:"厢小",
i32_gt_s:"廂大",i32_gt_u:"厢大",i32_le_s:"廂小同",i32_le_u:"厢小同",i32_ge_s:"廂大同",i32_ge_u:"厢大同",
f32_eq  :"𪂼同",  f32_ne:"𪂼異",  f32_lt:"𪂼小",    f32_gt:"𪂼大",    f32_le:"𪂼小同",
//6_
f32_ge:"𪂼大同",f64_eq:"𩮌同",f64_ne:"𩮌異",f64_lt:"𩮌小",f64_gt:"𩮌大",f64_le:"𩮌小同",f64_ge:"𩮌大同"
i32_clz:"圭領陰",i32_ctz:"圭尾陰",i32_popcnt:"圭爆陽",
i32_add:"相加",i32_sub:"相減", i32_mul:"相乘", i32_div_s":"湘除",i32_div_u:"相除",i32_rem_s:"湘餘"

//7_
i32_rem_u:"相餘","i32_and:"相且", i32_or: "相或", i32_xor:"相斥", i32_shl:"相左移",i32.shr_s: "湘左移",
i32_shr_u:"相右移",i32_rotl:"相左旋", i32.rotr:"相右旋",   i64.clz:"卦領陰", i64_ctz:"卦尾陰",i64.popcnt:"卦爆陽",
i64.add:  "厢加", i64.sub:"厢減",  i64_mul:"厢乘", i64_div_s:"廂除",

//8
i64_div_u:"厢除", i64.rem_s:"廂餘", i64_rem_u:"厢餘", i64_and  :"厢且", i64_or :"厢或",i64_xor:"厢斥", 
i64_shl  :"厢左移", i64_shr_s:"廂右移", i64_shr_u:"厢右移" ,i64_rotl :"厢左旋", i64_rotr :"厢右旋",
f32_abs  :"䳏絕正", f32_neg  :"䳏負反", f32_ceil: "䳏天板", f32_floor:"䳏地板", f32_trunc:"䳏截整",
f32_nearest: "䳏極近", f32_sqrt:"䳏方根",
f32_add     :"𪂼加",   f32_sub: "𪂼減", f32_mul:"𪂼乘", f32.div:"𪂼除", 
f32_min:     "𪂼最小",   f32_max: "𪂼最大", f32_copysign:"䳏抄號"
f64_abs:     "𦐰絕正",   f64_neg: "𦐰負反", f64_ceil:"𦐰天板", f64.floor:"𦐰地板", f64_trunc:"𦐰截整",
f64_nearest: "𦐰極近", f64_sqrt: "𦐰方根",
f64_add:"𩮌加",	f64_sub:"𩮌減",f64_mul:"𩮌乘",f64.div:"𩮌除",
f64.min:"𩮌小", f64.max:"𩮌大",f64_copysign: "𦐰抄號",
i32_wrap_i64     :"圭包卦",  i32_trunc_f32_s:"圭截䳏",  i32_trunc_f32_u:"洼截䳏",
i32_trunc_f64_s  :"洼截𦐰", i32_trunc_f64_u:""圭截𦐰", i64.extend_i32_s:"啩展洼",
i64.extend_i32_u :"卦展圭",  i64_trunc_f32_s:"啩截䳏",  i64_trunc_f32_u:"卦截䳏",
i64_trunc_f64_s  :"啩截𦐰",  i64_trunc_f64_u:"卦截𦐰", 
f32.convert_i32_s:"䳏變洼",f32.convert_i32_u:"䳏變圭", 
f32.convert_i64_s:"䳏變啩",f32_convert_i64_u:"䳏變卦",   f32_demote_f64:"䳏降𦐰",
f64.convert_i32_s:"𦐰變洼",f64_convert_i32_u:"𦐰變圭",
f64.convert_i64_s:"𦐰變啩",f64_convert_i64_u:"𦐰變卦",   f64_promote_f32:"𦐰升䳏",
i32_reinterpret_f32:"圭譯䳏",i64_reinterpret_f64:"卦譯𦐰",
f32.reinterpret_i32:"䳏譯圭",f64_reinterpret_i64:"䳏譯卦"
