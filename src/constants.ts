export enum Var { i32=127, i64=126, f32=125, f64=124, anyfunc=112, func=96, none=64 }
export enum ExternalKind {function =0,table =1,memory=2,global=3}
export enum Inst {
    unreachable=0,nop=1,block=2,loop=3,if=4,else=5,end=11, br=12,br_if=13,br_table=14,
    return=15,call=16,call_indirect=17, drop=26,select=27,
    get_local=32,set_local=33,tee_local=34,get_global=35,set_global=36,
    i32_load=40   ,i64_load   =41,f32_load    =42,f64_load=43,
    i32_load8_s=44,i32_load8_u=45,i32_load16_s=46,i32_load16_u=47,
    i64_load8_s=48,i64_load8_u=49,i64_load16_s=50,i64_load16_u=51,i64_load32_s=52,i64_load32_u=53,
    i32_store=54,i64_store=55,f32_store=56,f64_store=57,i32_store8=58,i32_store16=59,
    i64_store8=60,i64_store16=61,i64_store32=62,
    memory_size=63,memory_grow=64, i32_const=65, i64_const=66, f32_const=67, f64_const=68,
    i32_eqz=69, i32_eq=70, i32_ne=71,
    i32_lt_s=0x48,i32_lt_u=0x49,i32_gt_s=0x4a,i32_gt_u=0x4b,i32_le_s=0x4c,i32_le_u=0x4d,i32_ge_s=0x4e,i32_ge_u=0x4f,

    i32_add=106,i32_sub=107,i32_mul=108,i32_div_s=109,
    i32_and = 0x71,i32_or=0x72,i32_xor=0x73,i32_shl=0x74,i32_shr_s=0x75,i32_shr_u=0x76,i32_rotl=0x77,i32_rotr=0x78,
    f32_abs=0x8b,f32_neg=0x8c,f32_ceil=0x8d,f32_floor=0x8e,f32_trunc=0x8f,f32_nearest=0x90,f32_sqrt=0x91,
    f32_add=0x92,f32_sub=0x93,f32_mul=0x94,f32_div=0x95,f32_min=0x96,f32_max=0x97,f32_copysign=0x98,
    f64_abs=0x99,f64_neg=0x9a,f64_ceil=0x9b,f64_floor=0x9c,f64_trunc=0x9d,f64_nearest=0x9e,f64_sqrt=0x9f,
    f64_add=0xa0,f64_sub=0xa1,f64_mul=0xa2,f64_div=0xa3,f64_min=0xa4,f64_max=0xa5,f64_copysign=0xa6,
    i32_wrap_i64=0xa7,i32_trunc_f32_s=0xa8,
}
export enum sectionCode {TYPE=1,IMPORT=2,FUNCTION=3,TABLE=4,MEMORY=5,GLOBAL=6,EXPORT=7,START=8,ELEMENT=9,CODE=10,DATA=11}
export type bytecode=number;
export type bytecodes=bytecode[];
export const START='_start';

export const InstNames=[];
for (let n in Inst){
    InstNames[ Inst[n] ] =n;
}