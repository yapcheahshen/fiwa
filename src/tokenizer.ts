/* Tokenizer is learning new chinese words on the way */
import {isOrdinal} from "./ordinal.ts";
import {codeOfSym} from './namer.ts'
import {isEmojiSymbol, isEmoji} from './emojisym.ts';

export enum TokenType {
  blank=0;
  ascii=1;  //might combine
  chinese=2; //might combine
  ordinal=3;
  emoji=4;
  separator=10; //only one char allow for a token
}
export const tokenType:TokenType=cp=>{
  if (!cp) return TokenType.blank;
  if (cp<=0x20) return TokenType.blank;
  if (cp<0x100) {
    return TokenType.ascii;
  } else if (isOrdinal(cp)) {
    return TokenType.ordinal; 
  } else if (isEmoji(cp)) { 
    return TokenType.emoji;
  } else if ((cp>=0x3400&&cp<=0x4db5) ||(cp>=0x4e00&&cp<=0x9fff) || (cp>=0xd800&&cp<=0xdcff )||(cp>=0xe000&&cp<=0xf9ff )) {
    return TokenType.chinese;
  } else return TokenType.separator;
}


export interface TTokenier {
	tib:string;
	ptib,ntib:number;
	lexicon: [number,number, number][];
	next():string;
  newLexeme(from,to,end):void;
	reset(tib):void;
	end():boolean;
}
export type TokenHandler={
	 (tk: string): boolean;
}
export type CountedString=[addr:number,cnt:number, type:number];
export class Tokenizer implements TTokenizer{
  constructor (tib=''){
  	this.reset(tib);
  }
  reset(buf:string):void{
    this.tib=buf;
    this.ntib=0;
    this.lexicon=[];
    this.macroBackward=[];
  }
  end():boolean{
  	return ntib>=tib;
  }
  skipBlank(){
  	let ntib=this.ntib;
  	while (this.tib.codePointAt(ntib)<=0x20) ntib++; //skip blank characters
  	this.ntib=ntib;
  }
  firstMatch(_from:number,_to:number,tib:string, lexicon:CountedString[]):number{ //找第一個符合的
    tib=tib||this.tib;
    lexicon=lexicon||this.lexicon
	  const tofind=tib.slice(_from,_to);
  	for (let i=lexicon.length-1;i>=0;i--) {
  		const [from,to]=lexicon[i];
  		if (tofind.startsWith(tib.slice(from,to))) {
			return to-from;
  		}
  	}
  	return 0;
  }
  getLexicon() {
    return this.lexicon.map(([from,to,macro])=>
      [this.tib.slice(from,to), macro?this.tib.slice(to+1,macro):'' ]);
  }
  bestMatch(_from:number,_to:number,tib:string, lexicon:CountedString[]):number {//找最長符合的
  	let bestlen=0;//this is slow ... speed up later
    tib=tib||this.tib;
    lexicon=lexicon||this.lexicon;
    const tofind=tib.slice(_from,_to);
  	for (let i=lexicon.length-1;i>=0;i--) {
  		const [from,to]=lexicon[i];
  		if (tofind.startsWith(tib.slice(from,to))) {
  			if (to-from>bestlen) {
  				bestlen=to-from;
  			}
  		}
  	}
  	return bestlen;
  }
  newLexeme(from,to, macroend=0) {
    const tk=this.tib.slice(from,to).trim();
    if (!tk) return;
    if (codeOfSym(tk)!==-1) return ;
    if (tk.slice(0,2)=='0x' && !isNaN(parseInt(tk.slice(2),16))) {
      return;
    }
    const cp=tk.charCodeAt(0);
    if (cp<0x3400) return;
    // if (cp>=0xd800&&cp<0xdcff&&tk.length<3) return;
    this.lexicon.push([from,to,macroend]);
  }
  breakat(_from,_to):number{
  	const bestlen=this.bestMatch(_from,_to); //開頭最長符號
  	if (bestlen) return bestlen;
  	for (let i=_from+1;i<_to;i++) { //break by first matching word
  		const at=this.firstMatch(i,_to);
      if (at>0) {
        this.newLexeme(_from,i);
        return i-_from;
      }
  	}
    this.newLexeme(_from,_to);
  }
  peek():string{
  	const mark=this.ntib;
  	this.next();
  	const now=this.ntib;
  	this.ntib=mark;
  	return [start,now];
  }
  token(){
    return this.tib.slice(this.ptib,this.ntib);
  }
  eatString(){
    this.ntib++;
    while (this.ntib<this.tib.length) {
      const ch=this.tib[this.ntib];
      if (ch==='\\') {
        this.ntib++;
      } else if (ch=='"'){
        this.ntib++;
        break;
      }
      this.ntib++;
    }
  }
  next(noautobreak=false) {//codePointAt 能正確讀一個 UTF32 字元
    // this.skipBlank();
    this.ptib=this.ntib;
    let ntib=this.ntib;
    const tib=this.tib;
    const cp=tib.codePointAt(ntib);
    const ct=tokenType(cp);
    let stopconcat=false;
    let count=0;
    if (cp==0x22) {
       this.eatString();
       return;
    }
    while (ntib<tib.length) {
        if (tib.codePointAt(ntib)>0xffff) ntib++;
        ntib++;
        count++;
        const cp2=tib.codePointAt(ntib)
        const ct2=tokenType(cp2);
        // console.log(count,tib.slice(this.ntib,ntib),ct2,cp, ntib-this.ntib)
        const mayfollow= ct2==TokenType.emoji || ct2==TokenType.ordinal;
        if (stopconcat) break;
        if (ct2===ct) {
          if (mayfollow) break;
        } else {
          if (cp2==0x5b && ct!==TokenType.separator && ct!==TokenType.blank) {
             while (ntib<tib.length && tib.charAt(ntib)!==']') ntib++;
             continue;
          }
          if (mayfollow) { 
            if (ct===TokenType.chinese) stopconcat=true;
          }
          else break;          // console.log('breaking',mayfollow,ct,ct2,stopconcat)
        }
    }
    if (tib.codePointAt(ntib-1)>=0xFFFF) ntib++;

    if (!noautobreak) {
      const bestlen=this.breakat( this.ntib, ntib);
      if (bestlen>0) {
        this.ntib+=bestlen;
        return;
      }
    }
    this.ntib=ntib;
  }
  run(str:string) {
  	this.reset(str);
  	const out:[]=[];
    while (this.ntib<this.tib.length) {
      let start=this.ntib;
      this.next();
      let tk=this.tib.slice(start,this.ntib);
      out.push([tk, start, this.ntib ] );
    }
    return out;
  }
}