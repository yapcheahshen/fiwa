import {Inst,InstNames} from './constants.ts'
import {CNamesInst} from './cinst.ts'
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
    	bc=Inst[CNamesInst[tk]];
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

//only BMP
//帶序字
export const NumberedChar='⑴⒈①⓵⒜ⓐⒶ㊀㈠㍘㏠㋀'; //these can be use to represent code+number

export const NumberedFirstChar=(nc:string):string=>{
	const cp=nc.codePointAt(0);
    if (cp>=0x2474&&cp<=0x2487) return 0x2474;// ⑴~20
    else if (cp>=0x2460&&cp<=0x2473) return 0x2460;// ①~20
    else if (cp>=0x24f5&&cp<=0x24fe) return 0x24f5;// ⓵~10
    else if (cp>=0x2488&&cp<=0x249b) return 0x2488;// ⒈~20
    else if (cp>=0x249c&&cp<=0x24b5) return 0x249c;// ⒜~26
    else if (cp>=0x24b6&&cp<=0x24cf) return 0x24b6;// Ⓐ~26
    else if (cp>=0x24d0&&cp<=0x24e9) return 0x24d0;// ⓐ~26
    
    else if (cp>=0x3220&&cp<=0x3229) return 0x3220;// ㈠~10
    else if (cp>=0x3280&&cp<=0x3289) return 0x3280;// ㊀~10
    else if (cp>=0x3358&&cp<=0x336f) return 0x3358;// ㍘~23
    else if (cp>=0x32c0&&cp<=0x32cb) return 0x32c0;// ㋀~12
    else if (cp>=0x33E0&&cp<=0x33FE) return 0x33E0;// ㏠~31
   	return nc;
}

export const extractNumberedChar=(nc:string):string=>{
	const tt=tokenType(nc);
	const cp=nc.codePointAt(0)
	if (tt==TokenType.get_local||tt==TokenType.set_local|tt==TokenType.tee_local
	||tt==TokenType.get_global||tt==TokenType.set_global) {
		return (cp-NumberedFirstChar(nc)).toString();
	}
	return '';
}