//a look ahead, no back patching macro expansion
//allow following token to be preprocess
//no knowlege of syntax and type infomation (except number non-number)
//²¹  , first and second previous token
//₁₂  , ₘₙ peek 1~2 token, numeric or literal
//if specified, if will not output unless specified.
//
// ₁₂ drop the next 2 token if it is number
// ₂  same as above, as ntib already moved
// ₘ  if next first is non numberic and no-blank, consume it
// 
import {charType,CharType} from './token.ts'

enum ForwardType { num=1,alpha=2 };

export function execMacro(name, macrostart, macroend) {
	const start=this.ntib;
	let ntib=start;
	let p=macrostart;
	let ch=this.tib.charAt(p);
	let peek=0;
	const peeking=[];
	const forwards=[];
	while ( p < macroend && ch!==')') {//get the macro parameters
		if (ch=='₁'||ch=='₂') peeking[ch.charCodeAt(0) - '₁'.charCodeAt(0)]=ForwardType.num;
		else if (ch=='ₘ'||ch=='ₙ') peeking[ch.charCodeAt(0) - 'ₘ'.charCodeAt(0)]=ForwardType.alpha;
		ch=this.tib.charAt(p++);
	}

	let j=this.ntib, runnable=true;
	for (let i=0;i<peeking.length;i++) {
		if (!peeking[i]) {
			throw "cannot reference ₂,ₙ without ₁,ₘ";
		}
		while (this.ntib<this.tib.length) {
			this.next();
			const tk=this.token();
			forwards.push(tk);
			const ty=charType(tk.codePointAt(0));
			if (ty==CharType.ascii || ty==CharType.chinese) {
				if (isNaN(parseInt(tk)) ) {
					if (peeking[i]==ForwardType.num) {
						runnable=false; break;
					}
				} else {
					if (peeking[i]!==ForwardType.num) {
						runnable=false;
						break;
					}
				}
			}
		}
	}
	if (runnable) {
		this.next();//drop the macro call
		this.macroReturn=this.ntib;
		this.macroEnd=macroend-1; //drop the )
		this.macroForward=forwards;
		this.ntib=macrostart;
		// console.log(this.ntib,this.macroReturn,macroend)
	} else {
		this.ntib=start;
	}
	return runnable;
}
export function macroReplace(tk){
	if (tk=='¹') return this.macroBackward[0];
	else if (tk=='²') return this.macroBackward[0];
	else if (tk=='₁'||tk=='₂') return this.macroForward[tk.charCodeAt(0) - '₁'.charCodeAt(0)];
	else if (tk=='ₘ'||tk=='ₙ') return this.macroForward[tk.charCodeAt(0) - 'ₘ'.charCodeAt(0)];
	return tk;
}
// macro will be hide like comment
export function parseMacro() { 
	this.next(); //skip the (#
	const start=this.ntib;
	this.next(true); //do not use auto break
	const macroname=this.tib.slice(start,this.ntib);
	let ntib=this.ntib;
	while ( ntib <this.tib.length && this.tib.charAt(ntib)!==')') {
	 	ntib++;
	}
	if (this.tib.charAt(ntib)==')') ntib++;
	this.newLexeme(start,this.ntib, ntib);
	
	return ntib;
}