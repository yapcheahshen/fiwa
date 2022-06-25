/* transpile byte code in and from wasm */
import {Inst,InstNames} from './constants.ts';
import {Tokenizer} from './tokenizer.ts';
import {tokenType,tokenTypeName,NumberedChar,extractNumberedChar} from './token.ts'
import {InstCNames,CNamesInst} from './cinst.ts'
import {getForwardOperand,ForwardOperand} from './bytecode.ts'
import {parseNumber,encInt,encUInt,decodeInt,decodeUInt} from './utils.ts';
export class Transliterator {
	constructor(){
 

	}
	translate(code,bytes,at,lang){
		let idv=0, operand=0;
		let name=InstNames[code] ;
		const forwardOperand=getForwardOperand(code);
		if (forwardOperand) {
			if (forwardOperand==ForwardOperand.uint8) {
				let n=bytes[at+1];
				if (parseInt(n)>255) n='255';
				operand=n;
				idv=1;
			} else if (forwardOperand==ForwardOperand.leb128) {
				const [n,count]=decodeUInt(bytes,at+1);
				operand=n;
				idv=count;					
			} else if (forwardOperand==ForwardOperand.dual128) { //load/store offset/align, drop it
				let [n,count]=decodeUInt(bytes,at+1);
				idv+=count;
				[n,count]=decodeUInt(bytes,at+count);
				operand='';
				idv+=count;
			}
		}

		if (lang=='zh') {
			name=InstCNames[name];
			if (~NumberedChar.indexOf(name)) {
				name=String.fromCodePoint(name.codePointAt(0)+operand);
			} else {
				if(forwardOperand) name+=operand;
				if (code==Inst.loop || code==Inst.block || code==Inst.if) name=name.replace('64','') 
			}
		} else {
			if(forwardOperand) name+=operand;
			if (lang=='concise') {
				name=name.replace(/i32_/g,'');
				name=name.replace(/block64/g,'blk');
				name=name.replace(/([^_])if64/g,'$1if'); //aware of br_if 
				name=name.replace(/loop64/g,'loop');
				name=name.replace(/e[et]_local/g,'l');
				name=name.replace(/et_global/g,'g');
			}
		}


		return [name,idv];
	}
	toText(bytes,lang=''){
		let i=0;
		let out='';
		while (i<bytes.length) {
			const code=bytes[i];
			if (code==Inst.i32_const || code==Inst.i64_const) {
				const [n,count]=decodeInt(bytes,i+1);
				out+=' '+n;
				i+=count;
			} else {
				let [name,adv] = this.translate( code,bytes,i, lang);
				out+=(lang=='zh'?'':' ')+name;
				i+=adv;
			}
			i++;
		}
		return out.trim();
	}
	expandName(tk,lang){
		if (lang=='concise') {
			tk=tk.replace(/^blk$/g,'block')
			.replace(/^tl/g,'tee_local')
			.replace(/^gl/g,'get_local')
			.replace(/^sl/g,'set_local')
			.replace(/^gg/g,'get_global')
			.replace(/^sg/g,'set_global');
			if (!Inst[tk] && Inst['i32_'+tk]) tk='i32_'+tk;
			return Inst[tk];
		} else if (lang=='zh') { 
			const inst=CNamesInst[tk] ||tokenTypeName(tokenType(tk));
			return Inst[inst];
		} else return Inst[tk];
	}
	fromText(buf,lang){
		let tokens=[];
		if (lang=='zh') {
			const tknr=new Tokenizer();
			tokens=tknr.run(buf).map(it=>it[0]).filter(it=>!!it.trim());
		} else {
			tokens=buf.split(' ').filter(it=>!!it.trim());
		}
		
		const out=[];
		let i=0;
		while (i<tokens.length) {
			let tk=tokens[i],nxt='';
			let inst=this.expandName(tk,lang);
			const [n,const_type]=parseNumber(tk);
			// if (lang=='zh') console.log(tk,Inst[tokenTypeName(tokenType(tk))],inst,n,const_type)
			if (!const_type && typeof inst=='undefined') {
				const m=tk.match(/(\d+)$/);
				if (m) {
					tk=tk.slice(0,tk.length-m[1].length);
					nxt=m[1];
					inst=this.expandName(tk,lang);
				}
			}
			if (!const_type && lang==='zh') {
				if (inst==Inst.br_if || inst==Inst.br ) {
					nxt=tokens[++i]; //要不要換成 序字？ label ㍘
				} else {
					nxt=extractNumberedChar(tk);
				}
			}
			if ( nxt==''&& (inst==Inst.if || inst==Inst.loop || inst==Inst.block)) {
				nxt='64';//default i32_const
			}
			if (inst||inst===0) {
				out.push(inst);
				const fw=getForwardOperand(inst)
				if (fw) {
					if (fw===ForwardOperand.dual128) {
						out.push(2,0); //align, offset
					} else {
						const [n,const_type]=parseNumber(nxt);
						out.push( ...encUInt(n));						
					}
				}
				i++;
				continue;
			}
			
			if (const_type) {
				out.push(const_type, ...encInt(n) ); 
			} else {
				console.log('nop',inst,tk)
				out.push(Inst.nop);
			}
			i++
		}
		return out;
	}
}