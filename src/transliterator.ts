/* transpile byte code in and from wasm */
import {Mnemonic,Instructions,InstAttr,immOfSym,codeOfSym,ordinalOf} from './namer.ts';
import {Tokenizer} from './tokenizer.ts';
import {parseNumber,encInt,encUInt,decodeInt,decodeUInt} from './utils.ts';
export class Transliterator {
	constructor(){
	}
	translate(code,bytes,at,lang){
		let idv=0, operand='';
		const inst=Instructions[code]
		let name=inst[InstAttr.id];
		const immediate=inst[InstAttr.immediate];
		if (immediate) {
			if (immediate==1) {
				const [n,count]=decodeUInt(bytes,at+1);
				operand=n.toString();
				idv=count;					
			} else if (immediate==2) { //load/store offset/align, drop it
				let [n,count]=decodeUInt(bytes,at+1);
				idv+=count;
				[n,count]=decodeUInt(bytes,at+count);
				idv+=count;
			}
		}
		if ((code==Mnemonic.loop || code==Mnemonic.block || code==Mnemonic.if) && operand=='64') {
			operand='';
		}

		name=(lang=='concise'?inst[InstAttr.en]:name)+(immediate==1?operand:'');
		if (lang=='zh') {
			name=inst[InstAttr.zh];
			const [firstord,imm,max]=ordinalOf(name);
			if (firstord && parseInt(operand)<max) { //has ordinal
				name=String.fromCodePoint(firstord+parseInt(operand));
			} else {
				if(immediate==1) name+=operand;
			}
		}
		return [name,idv];
	}
	toText(bytes,lang=''){
		let i=0;
		let out='';
		while (i<bytes.length) {
			const code=bytes[i];
			if (code==Mnemonic.i32_const || code==Mnemonic.i64_const) {
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
			let tk=tokens[i];
			const [n,const_type]=parseNumber(tk);
			if (const_type) {
				out.push(const_type, ...encInt(n) ); 
				i++
				continue;
			}
			let code=codeOfSym(tk);
			let n2=immOfSym(tk);
			if (code==-1) {
				out.push(Mnemonic.unreacheble);
				i++;
				continue;
			}
			let inst=Instructions[code];
			let imm=immOfSym(tk);
			if (code==Mnemonic.if || code==Mnemonic.loop || code==Mnemonic.block) {
				imm=64;//default i32_const
			}

			out.push(code);
			const immediate=inst[InstAttr.immediate]
			if (immediate==2) {
				out.push(2,0); //align, offset
			} else if (immediate==1) {
				out.push( ...encUInt(imm));						
			}
			i++
		}
		return out;
	}
}