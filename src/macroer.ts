//a look ahead, no back patching macro expansion
//allow following token to be preprocess
//no knowlege of syntax and type infomation (except number non-number)
//²¹  , first and second previous token
//₁₂  , ₘₙ peek 1~2 token, numeric or literal
//if specified, if will not output unless specified.
//
// ₁₂ drop the next 2 token if it is number, swaping
// ₂  same as above, as ntib already moved
// ₘ  if next first is non numberic and no-blank, consume it
// 
import {charType,CharType} from './token.ts'
import {Tokenizer} from './tokenizer.ts';
interface TMacroer{
  macroReturn:number; //return to this ntib after macro finish
  macroEnd   :number ; //run until here
  macroForward:string[];
  macroBackward:string[];
}
export class Macroer extends Tokenizer implements TMacroer {
  constructor(){
  	super();
  }
  addMacro(name,def){
   	addMacro.call(this,name,def);
  }  
  findMacro(name) {
    for (let i=this.lexicon.length-1;i>=0;i--) {
      const [from,to,macro]=this.lexicon[i];
      if (!macro) continue;
      if (this.tib.slice(from,to)===name) {
        return [to,macro];
      }
    }
  }
  run(str:string){ 
  	this.reset(str);
  	const out=[];
    while (this.ntib<this.tib.length) {
      let start=this.ntib;
      this.next();
      let tk=this.token();

			if (tk[0]=='#') {
				 this.ntib=parseMacro.call(this);
				 continue;
			}

      if (this.macroReturn) {//macro expanding
        if (start>=this.macroEnd) {
          this.ntib=this.macroReturn;
          this.macroReturn=0;
        } else {
          const newtk=macroReplace.call(this,tk);
      	  tk=newtk;
        }
      } else {
        const macro=this.findMacro(tk);
        if (macro) { //if macro cannot be execute, macroReturn is zero
          if (execMacro.call(this,tk,...macro)) {//可執行後面就不輸出了
            continue;
          }
        }
      }
      const ct=charType(tk.codePointAt(0));
      if (ct==CharType.ascii||ct==CharType.chinese) {
        this.macroBackward.unshift(tk);
        this.macroBackward.length=2;
      }
      // console.log(tk,this.tib.slice(start,start+tk.length))
      out.push([tk, start, this.ntib] );
    }
    return out;
  }
}
enum ForwardType { num=1,alpha=2 };

export function execMacro(name, macrostart, macroend) {
	const start=this.ntib;
	let ntib=start;
	let p=macrostart;
	let ch=this.tib.charAt(p);
	let peek=0;
	const peeking=[];
	const forwards=[];

	while ( p < macroend) {//get the macro parameters
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
		this.macroEnd=macroend; //drop the )
		this.macroForward=forwards;
		this.ntib=macrostart;
		this.skipBlank();
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
	const start=this.ntib;
	this.next(true); //do not use auto break
	const macroname=this.tib.slice(start,this.ntib);
	const tokenend=this.ntib;
	this.skipBlank();
	let ntib=this.ntib;
	while ( ntib <this.tib.length && this.tib.codePointAt(ntib)>0x20) {
	 	ntib++;
	}

	this.newLexeme(start,tokenend ,ntib);	
	this.ntib=ntib;
	return ntib;
}