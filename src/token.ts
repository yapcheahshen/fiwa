import {Inst,InstNames} from './constants.ts'
import {CInstNames} from './cinst.ts'
export enum CharType {
	blank=0;
	ascii=1;  //might combine
	chinese=2; //might combine
	separator=3; //only one char allow for a token
}
export enum TokenType {
	space=0;
	constant=1;
	bytecode=2;
	get_local=11;
	set_local=12;
	tee_local=13;
	get_global=14;
	set_global=15;
	macro=20;
	macroforward=21;
	macrobackward=22;
	branch=30;
	function=40;
}
export const charType:CharType=cp=>{
	if (cp<=0x20) return CharType.blank;
	if (cp<0x2000) {
		return CharType.ascii;
	} else if ((cp>=0x3400&&cp<=0x9fff) || (cp>=0xd800&&cp<=0xdcff )||(cp>=0xe000&&cp<=0xf9ff )) {
		return CharType.chinese;
	} else return CharType.separator;
}

export const tokenTypeName=(tt:TokenType):string=>{
	if (tt==TokenType.constant) return 'constant'
	else if (tt===TokenType.bytecode) return 'bytecode'
	else if (tt===TokenType.get_local)return 'get_local';
	else if (tt===TokenType.set_local)return 'set_local';
	else if (tt===TokenType.tee_local)return 'tee_local';
	else if (tt===TokenType.get_global)return 'get_global';
	else if (tt===TokenType.set_global)return 'set_global';
	else if (tt===TokenType.function)return 'function';
	else if (tt===TokenType.nop)     return 'nop';
	else if (tt===TokenType.macrobackward||tt===TokenType.macroforward)     return 'macro';

}
export const tokenType:TokenType=tk=>{
	const cp=tk.codePointAt(0);
    if (cp>=0x2474&&cp<=0x2487) return TokenType.get_local;// ⑴
    else if (cp>=0x2460&&cp<=0x2473) return TokenType.set_local;// ①
    else if (cp>=0x24f5&&cp<=0x24fe) return TokenType.tee_local;// ⓵
    else if (cp>=0x249c&&cp<=0x24b5) return TokenType.get_glocal;// ⒜
    else if (cp>=0x24d0&&cp<=0x24e9) return TokenType.set_glocal;// ⓐ
    else if (~'²¹'.indexOf(tk)) return TokenType.macrobackward;
    else if (~'₁₂ₘₙ'.indexOf(tk)) return TokenType.macroforward;
    if (parseInt(tk).toString()==tk) {
    	return TokenType.constant;
    } else if ( tk.slice(0,2)==='0x' && 
    	parseInt(tk.slice(2),16).toString(16)===tk.slice(2)) {
    	return TokenType.constant;
	}
    let bc=InstNames[tk]; 
    if (!bc && bc!==0) {
    	bc=Inst[CInstNames[tk]];
    }
    if (bc || bc===0) {
    	if (bc===Inst.block||bc===Inst.loop||bc===Inst.if||bc===Inst.else
    		||bc===Inst.end||bc===Inst.br||bc===Inst.br_if||bc===Inst.br_table) {
    		return TokenType.branch;
    	}
    	return TokenType.bytecode;
    }

    return TokenType.function;
}