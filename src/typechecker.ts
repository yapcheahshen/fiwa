import {Tokenizer} from './tokenizer.ts';
// import {stackEffect} from './bytecode.ts';
// import {tokenType,TokenType} from './token.ts'
export class TypeChecker {
	constructor(){

	}
	run(str:string,lang:string){
		// const tknr=new Tokenizer()
		// const tokens=tknr.run(str);
		// const out=[];
		// let depth=0; 
		// for (let i=0;i<tokens.length;i++){
		// 	const [tk]=tokens[i];
		// 	const tt=tokenType(tk,lang);
		// 	if (tt==TokenType.loop||tt==TokenType.block||tt==TokenType.if) depth++;
		// 	else if (tt==TokenType.end) depth--;
		// 	out.push([...tokens[i] , tt, depth, stackEffect(tk)] );
		// } 
		// return out;
		return [];
	}
} 