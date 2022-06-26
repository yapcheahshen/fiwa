import {Inst,InstNames} from './constants.ts'
import {CNamesInst,InstCNames} from './cinst.ts'
import {parseNumber} from './utils.ts';

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
	br=30;
	br_if=31;
	br_table=32;
	//pushing depth
	loop=40;
	block=41;
	if=42;
	//poping depth
	end=50;

	call=62;
	call_indirect=63;

	symbol=70;
}
export const charType:CharType=cp=>{
	if (cp<=0x20) return CharType.blank;
	if (cp<0x100) {
		return CharType.ascii;
	} else if ((cp>=0x3400&&cp<=0x4db5) ||(cp>=0x4e00&&cp<=0x9fff) || (cp>=0xd800&&cp<=0xdcff )||(cp>=0xe000&&cp<=0xf9ff )) {
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
	else if (tt===TokenType.loop)return 'loop';
	else if (tt===TokenType.block)return 'block';
	else if (tt===TokenType.br)return 'br';
	else if (tt===TokenType.if)return 'if';
	else if (tt===TokenType.br_if)return 'br_if';
	else if (tt===TokenType.br_table)return 'br_table';
	else if (tt===TokenType.call)return 'call';
	else if (tt===TokenType.return)return 'return';
	else if (tt===TokenType.call_indirect)return 'call_indirect';
	else if (tt===TokenType.end)return 'end';
	else if (tt===TokenType.nop)     return 'nop';
	else if (tt===TokenType.macrobackward||tt===TokenType.macroforward) return 'macro';
	else if (tt===TokenType.symbol)return 'symbol';
}
export const tokenType:TokenType=(tk:string,lang:string)=>{
	if (lang=='zh') return tokenType_zh(tk);
	else {
		const [n,const_type]=parseNumber(tk);
		if (const_type) {
			return TokenType.constant;
		}
		if (!tk.trim()) return TokenType.space;
		const inst=instByName(tk.replace(/\d+$/,''),lang);

		if (inst==Inst.get_local) return TokenType.get_local;
		else if (inst==Inst.set_local) return TokenType.set_local;
		else if (inst==Inst.tee_local) return TokenType.tee_local;
		else if (inst==Inst.get_global) return TokenType.get_global;
		else if (inst==Inst.set_global) return TokenType.set_gobal;
		else if (inst==Inst.get_local) return TokenType.get_local;
		else if (inst==Inst.br) return TokenType.br;
		else if (inst==Inst.br_if) return TokenType.br_if;
		else if (inst==Inst.br_table) return TokenType.br_table;
		else if (inst==Inst.loop) return TokenType.loop;
		else if (inst==Inst.block) return TokenType.block;
		else if (inst==Inst.end) return TokenType.end;
		else if (inst==Inst.if) return TokenType.if;
		else if (inst==Inst.call) return TokenType.call;
		else if (inst==Inst.call_indirect) return TokenType.call_indirect;
		else return TokenType.bytecode;
	}
}
export const conciseName=name=>{
	return name.replace(/i32_/g,'')
	.replace(/block64/g,'blk')
	.replace(/return/g,'ret')
	.replace(/^br_if/g,'bif')
	.replace(/^if64/g,'if') //aware of br_if 
	.replace(/loop64/g,'loop')
	.replace(/set_local/g,'$')
	.replace(/get_local/g,'=$')
	.replace(/tee_local/g,'@$')
	.replace(/set_global/g,'$g')
	.replace(/get_global/g,'=$g')
}
export const instByName=(tk,lang)=>{
	if (lang=='concise') {
		tk=tk.replace(/^blk$/g,'block')
		.replace(/^ret/g,'return')
		.replace(/^\=$g/g,'set_global')
		.replace(/^\$g/g,'get_global')
		.replace(/^bif/g,'br_if')
		.replace(/^\$(\d+)/g,'get_local$1')
		.replace(/^=\$(\d+)/g,'set_local$1')
		.replace(/^@\$(\d+)/g,'tee_local$1')
		if (!Inst[tk] && Inst['i32_'+tk]) tk='i32_'+tk;
		return Inst[tk];
	} else if (lang=='zh') { 
		const inst=CNamesInst[tk] ||tokenTypeName(tokenType(tk,lang));
		return Inst[inst];
	} else return Inst[tk];
}
export const tokenType_zh:TokenType=(tk:string)=>{
	const cp=tk.codePointAt(0);
	const [first,max]=NumberedFirstChar(tk);
	if (first==0x2474) return TokenType.get_local; //⑴
	else if (first==0x2460) return TokenType.set_local;//①
	else if (first==0xac00) return TokenType.call;  //가
	else if (first==0x33E0) return TokenType.br;   //㏠
	else if (first==0x4dc0) return TokenType.br_if;//䷀
	else if (first==0x32c0) return TokenType.br_table;//㋀
	else if (first==0x2488) return TokenType.tee_local; //⒈
	else if (first==0x249c) return TokenType.get_global;//⒜
	else if (first==0x24d0) return TokenType.set_global;//ⓐ
	else if (first==0x32d0) return TokenType.call_indirect; //㋐
    else if (~'²¹'.indexOf(tk)) return TokenType.macrobackward;
    else if (~'₁₂ₘₙ'.indexOf(tk)) return TokenType.macroforward;
    else if (tk[0]==InstCNames[InstNames[Inst.loop]]) return TokenType.loop;
    else if (tk[0]==InstCNames[InstNames[Inst.if]]) return TokenType.if;
    else if (tk[0]==InstCNames[InstNames[Inst.end]]) return TokenType.end;
    else if (tk[0]==InstCNames[InstNames[Inst.block]]) return TokenType.block;

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
    	return TokenType.bytecode;
    }

    return TokenType.function;
}

//only BMP
//帶序字
export const NumberedChar='⑴⒈①⓵⒜ⓐⒶ㊀㈠㍘㏠㋀䷀가'; //these can be use to represent code+number

export const NumberedFirstChar=(nc:string):string=>{
	const cp=nc.codePointAt(0);
    if (cp>=0x2474&&cp<=0x2487) return [0x2474,20];// ⑴~20
    else if (cp>=0xac00&&cp<=0xd7a3) return [0xac00,11171];// 가~11171 
    else if (cp>=0x4dc0&&cp<=0x4dff) return [0x4dc0,64];// ䷀~64
    else if (cp>=0x2460&&cp<=0x2473) return [0x2460,20];// ①~20
    else if (cp>=0x2488&&cp<=0x249b) return [0x2488,20];// ⒈~20
    else if (cp>=0x249c&&cp<=0x24b5) return [0x249c,26];// ⒜~26
    else if (cp>=0x24b6&&cp<=0x24cf) return [0x24b6,26];// Ⓐ~26
    else if (cp>=0x24d0&&cp<=0x24e9) return [0x24d0,26];// ⓐ~26    
    else if (cp>=0x3358&&cp<=0x336f) return [0x3358,23];// ㍘~23
    else if (cp>=0x33E0&&cp<=0x33FE) return [0x33E0,31];// ㏠~31
    else if (cp>=0x32c0&&cp<=0x32cb) return [0x32c0,12];// ㋀~12
    else if (cp>=0x3220&&cp<=0x3229) return [0x3220,10];// ㈠~10
    else if (cp>=0x3280&&cp<=0x3289) return [0x3280,10];// ㊀~10
    else if (cp>=0x24f5&&cp<=0x24fe) return [0x24f5,10];// ⓵~10
    else if (cp>=0x32d0&&cp<=0x32fe) return [0x32d0,10];// ㋐~10

   	return [0,0];
}

export const extractNumberedChar=(nc:string):string=>{
	const tt=tokenType(nc);
	const cp=nc.codePointAt(0)
	if (tt==TokenType.get_local||tt==TokenType.set_local|tt==TokenType.tee_local
	||tt==TokenType.get_global||tt==TokenType.set_global
	||tt==TokenType.call||tt==TokenType.call_indirect
	||tt==TokenType.br  ||tt==TokenType.br_if||tt==TokenType.br_br_table) {
		const [first,max]=NumberedFirstChar(nc);
		if (!first) throw "no first char for "+nc
		const n=cp-first;
		if (n<max) {
			return n.toString();
		} else {
			throw "exceed maximum encoding "+nc
		}
	}
	return '';
}