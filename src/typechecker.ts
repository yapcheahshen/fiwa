import {Tokenizer} from './tokenizer.ts';
import {stackEffect} from './bytecode.ts';
import {tokenType} from './token.ts'
export class TypeChecker {
	constructor(){

	}
	run(str:string){
		const tknr=new Tokenizer()
		const tokens=tknr.run(str);
		const out=[];
		for (let i=0;i<tokens.length;i++){
			const [tk]=tokens[i];
			out.push([...tokens[i] , tokenType(tk),stackEffect(tk)] );
		} 
		return out;
	}
} 