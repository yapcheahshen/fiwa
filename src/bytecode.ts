import {Inst,splitInstruction} from './constants.ts';
import {CInstNames} from './cinst.ts';
import {TokenType,tokenType} from './token.ts';
const buildStackEffect=()=>{
    const stackEffects=[];
    const Inst_0_0=splitInstruction(`unreachable,nop,else,end,return,call,block,loop,br`);
    const Inst_1_0=splitInstruction(`br_if,br_table,drop,set_local,set_global,i32_eqz,i32_load,i64_load,
        f32_load,f64_load,i32_load8_s,i32_load8_u,i32_load16_s,i32_load16_u
        ,i64_load8_s,i64_load8_u,i64_load16_s,i64_load16_u,i64_load32_s,i64_load32_u`);
    const Inst_2_1=splitInstruction(`i32_eq,i32_ne,
    i32_add,i32_sub,i32_mul,i32_div_s,i32_and,i32_or,i32_xor,i32_shr_s,i32_shr_u,i32_shl,
    i32_lt_s,i32_gt_s,i32_le_s,i32_ge_s`);
    const Inst_1_1=splitInstruction(`select,f32_abs,f32_neg,f32_ceil,f32_floor,f32_trunc,f32_nearestf32_sqrt,f32_copysign`);
    const Inst_2_0=splitInstruction(`i32_store,i64_store,f32_store,f64_store,i32_store8,i32_store8,i32_store16,i64_store8,i64_store16,i64_store32`)
    const Inst_0_1=splitInstruction(`i32_const,i64_const,get_local,tee_local,get_global`); 
    Inst_0_0.forEach( it=> stackEffects[Inst[it]]= 0+0 );
    Inst_0_1.forEach( it=> stackEffects[Inst[it]]= 10+1 ); // out, in
    Inst_1_0.forEach( it=> stackEffects[Inst[it]]= 10+0 );
    Inst_1_1.forEach( it=> stackEffects[Inst[it]]= 10+1 );
    Inst_2_1.forEach( it=> stackEffects[Inst[it]]= 10+2 );
    stackEffects[0]=0;
    return stackEffects;
}
const StackEffect=buildStackEffect();
export const stackEffect=(tk:string)=>{
	const tt=tokenType(tk);
	if (tt===TokenType.get_local) return 10;
	else if (tt===TokenType.set_local) return  1;
	else if (tt===TokenType.tee_local) return 11;
	else if (tt===TokenType.get_global) return 10;
	else if (tt===TokenType.set_global) return 1;
	else if (tt===TokenType.macroforward||tt===TokenType.backward) return 10;


    let bc=Inst[tk]; 
    if (!bc && bc!==0) {
    	bc=Inst[CInstNames[tk]];
    }
    if (!bc) return 0;
    return StackEffect[bc]||0;
}