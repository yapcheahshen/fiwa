import {Tokenizer} from './tokenizer.ts';
import {Namer} from 'fiwa';
import {parseNumber} from './utils.ts'
const {codeOfSym,Instructions,InstAttr} = Namer;
export class TypeChecker {
	constructor(){

	}
	run(str:string,lang:string){
		const tknr=new Tokenizer()
		const tokens=tknr.run(str);
		const out=[];
		let depth=0; 
		for (let i=0;i<tokens.length;i++){
			const [tk]=tokens[i];
			const code=codeOfSym(tk);
			if (!~code) {
				const [n,const_type]=parseNumber(tk);
				if (!const_type) continue;
				out.push([...tokens[i] , depth] );
				continue;
			}
			const inst=Instructions[code];
			depth+= (inst[InstAttr.depth]||0);
			out.push([...tokens[i] , depth] );
		} 
		return out;
		return [];
	}
} 