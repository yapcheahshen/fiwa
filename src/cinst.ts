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

// 需資料參與、靜態的素材                資材料    貝字和米部、木部 禾 𥹓 糆
// address,pointer 帶止 (指)
// 和程序相關的結構、網絡、組織相關用絲字部   
// assemble                 織
// compiling                編
// bit   爻  位元，二進制
// i8    爼  位元組  𦵔帶正負值 
// i16   㸚  2的四次方 i16_s 
// i32   圭
// i64   卦 
// f32𩿩鳰  f64糶糴
// i32_s 洼  (有正負值的 signed 多 一點二點或三點  㤊 潒 廂）
// i64_s 褂   
// f32可以表達難數清的數值，借鳥毛義。的操作含鳥、隹 𪂼 䳏(32 bits floating含鳥隹)    f64糶 糴 𩮌 𦐰(64bits 帶羽彡旁) 毛更多了
// 記憶體  憶 
// 讀入圭    入
// 寫出圭    出
// 寫出卦    粜
// 讀入卦    籴

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


//API       程𩡺
//constant  零進值出     圭   卦  䳏  𦐰 
//unary     一進值出     圭 洼-   卦 -褂   䳏  𦐰
//binary    二進值出     相32  湘32sign  厢64  廂(64sign)   𪂼(f32)  f64𩮌
//test      一進爻出     
//compare   二進爻出     同binary 用相
//轉換
//
//  絘 next
//駖集  䋂  爼
export const CNamesInst={
"◆":"unreachable", "◇":"nop","〈":"block","☉":"loop", "？":"if", "！":"else","〉":"end",//◎
"㏠":"br", "䷀":"br_if", "㋀":"br_table", "⏎":"return",

"가":"call", "㋐":"call_indirect", "𥹓":"drop", "⚤":"select",
"⑴":"get_local","①":"set_local","⒈":"tee_local", "⒜":"get_global", "ⓐ":"set_global",
//2_
"入":"i32_load",   "籴":"i64_load" ,"鳰":"f32_load",       "糴":"f64_load",
"𦵔入":"i32_load8_s",  "爼入":"i32_load8_u","泮入":"i32_load16_s","半入":"i32_load16_u", 
//3_
"𦵔籴":"i64_load8_s","爼籴":"i64_load8_u","𠅫籴":"i64_load16_s","㸚籴":"i64_load16_u",
"泮籴":"i64_load32_s","半籴":"i64_load32_u",     "出":"i32_store",     "粜":"i64_store",
"𩿩":"f32_store",     "糶":"f64_store",  "爼出":"i32_store8", "半出":"i32_store16",
"爼粜":"i64_store8", "㸚粜":"i64_store16",   "半粜":"i64_store32", "憶愹":"memory_size",
//4_
"憶脹":"memory_grow", "圭":"i32_const"    ,"卦":"t64_const",   "䳏":"f32_const",   "𦐰":"f64_const",
"空圭":"i32_eqz", "相同":"i32_eq",  "相異":"i32_ne",  "湘小":"i32_lt_s",  "相小":"i32_lt_u",
"湘大":"i32_gt_s", "相大":"i32_gt_u",  "湘小同":"i32_le_s","相小同":"i32_le_u","湘大同":"i32_ge_s","相大同":"i32_ge_u",
//5_
"空卦":"i64_eqz",  "厢同":"i64_eq","厢異":"i64_ne",  "廂小":"i64_lt_s",  "厢小":"i64_lt_u",
"廂大":"i64_gt_s","厢大":"i64_gt_u","廂小同":"i64_le_s","厢小同":"i64_le_u","廂大同":"i64_ge_s","厢大同":"i64_ge_u",
"𪂼同":"f32_eq",  "𪂼異":"f32_ne",  "𪂼小":"f32_lt",    "𪂼大":"f32_gt",    "𪂼小同":"f32_le",
//6_
"𪂼大同":"f32_ge","𩮌同":"f64_eq","𩮌異":"f64_ne","𩮌小":"f64_lt","𩮌大":"f64_gt","𩮌小同":"f64_le","𩮌大同":"f64_ge",
"圭領陰":"i32_clz","圭尾陰":"i32_ctz","圭爆陽":"i32_popcnt",
"相加":"i32_add","相減":"i32_sub", "相乘":"i32_mul", "湘除":"i32_div_s","相除":"i32_div_u","湘餘":"i32_rem_s",

//7_
"相餘":"i32_rem_u","相且":"i32_and", "相或":"i32_or", "相斥":"i32_xor", "相左移":"i32_shl","湘左移":"i32_shr_s",
"相右移":"i32_shr_u","相左旋":"i32_rotl", "相右旋":"i32_rotr", "卦領陰":"i64_clz", "卦尾陰":"i64_ctz","卦爆陽":"i64_popcnt",
"厢加":"i64_add", "厢減":"i64_sub",  "厢乘":"i64_mul", "廂除":"i64_div_s",

//8
"厢除":"i64_div_u", "廂餘":"i64_rem_s", "厢餘":"i64_rem_u", "厢且":"i64_and", "厢或":"i64_or","厢斥":"i64_xor", 
"厢左移":"i64_shl", "廂右移":"i64_shr_s", "厢右移":"i64_shr_u" ,"厢左旋":"i64_rotl", "厢右旋":"i64_rotr",
"䳏絕正":"f32_abs", "䳏負反":"f32_neg", "䳏天板":"f32_ceil", "䳏地板":"f32_floor", "䳏截整":"f32_trunc",
"䳏極近":"f32_nearest", "䳏方根":"f32_sqrt",
"𪂼加":"f32_add",   "𪂼減":"f32_sub", "𪂼乘":"f32_mul", "𪂼除":"f32_div", 
"𪂼最小":"f32_min",   "𪂼最大":"f32_max", "䳏抄號":"f32_copysign",
"𦐰絕正":"f64_abs",   "𦐰負反":"f64_neg", "𦐰天板":"f64_ceil", "𦐰地板":"f64_floor", "𦐰截整":"f64_trunc",
"𦐰極近":"f64_nearest", "𦐰方根":"f64_sqrt",
"𩮌加":"f64_add",	"𩮌減":"f64_sub","𩮌乘":"f64_mul","𩮌除":"f64_div",
"𩮌最小":"f64_min", "𩮌最大":"f64_max","𦐰抄號":"f64_copysign",
"圭包卦":"i32_wrap_i64",  "圭截䳏":"i32_trunc_f32_s",  "洼截䳏":"i32_trunc_f32_u",
"洼截𦐰":"i32_trunc_f64_s", "圭截𦐰":"i32_trunc_f64_u", "啩展洼":"i64_extend_i32_s",
"卦展圭":"i64_extend_i32_u",  "啩截䳏":"i64_trunc_f32_s",  "卦截䳏":"i64_trunc_f32_u",
"啩截𦐰":"i64_trunc_f64_s",  "卦截𦐰":"i64_trunc_f64_u", 
"䳏變洼":"f32_convert_i32_s","䳏變圭":"f32_convert_i32_u", 
"䳏變啩":"f32_convert_i64_s","䳏變卦":"f32_convert_i64_u",   "䳏降𦐰":"f32_demote_f64",
"𦐰變洼":"f64_convert_i32_s","𦐰變圭":"f64_convert_i32_u",
"𦐰變啩":"f64_convert_i64_s","𦐰變卦":"f64_convert_i64_u",   "𦐰升䳏":"f64_promote_f32",
"圭譯䳏":"i32_reinterpret_f32","卦譯𦐰":"i64_reinterpret_f64",
"䳏譯圭":"f32_reinterpret_i32","䳏譯卦":"f64_reinterpret_i64"
}

export const InstCNames={};
for (let n in CNamesInst) {
	InstCNames[CNamesInst[n]]=n;
}
