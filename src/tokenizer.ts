import {execMacro,parseMacro,macroReplace} from './macro.ts'
import {charType,CharType} from './token.ts'
export interface TTokenier {
	tib:string;
	ptib,ntib:number;
  macroReturn:number; //return to this ntib after macro finish
  macroEnd   :number ; //run until here
  macroForward:string[];
  macroBackward:string[];
	lexicon: [number,number][];
	next():string;
	reset(tib):void;
	end():boolean;
}
export type TokenHandler={
	 (tk: string): boolean;
}
export type CountedString=[addr:number,cnt:number, type:number];
export class Tokenizer {
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
  addMacro(name,def){
    addMacro.call(this,name,def);
  }
  skipComment():void {
    let ntib=this.ntib;
    const tib=this.tib;
    if (tib[ntib]=='\\') {
      while ( ntib <tib.length && tib.codePointAt(ntib)>=0x20) ntib++;
      return this.next();
    } else if (tib[ntib]=='(') {
      if (tib[ntib+1]=='#') {
        ntib=parseMacro.call(this);
      } else {
        while ( ntib <tib.length && tib.charAt(ntib)!==')') ntib++;
        ntib++; 
      }
      this.ntib=ntib;
      return ;
    } else return ;
    // console.log('comment',tib.slice(this.ntib,ntib));
    this.ntib=ntib;
  }
  skipBlank(){
  	let ntib=this.ntib;
  	while (this.tib.codePointAt(ntib)<=0x20) ntib++; //skip blank characters
  	this.ntib=ntib;
  }
  findMacro(name) {
    for (let i=this.lexicon.length-1;i>=0;i--) {
      const [from,to,macro]=this.lexicon[i];
      if (!macro) continue;
      if (this.tib.slice(from,to)===name) {
        return [to+1,macro];
      }
    }
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
  newLexeme(from,to,macro=0) {
    const tk=this.tib.slice(from,to);
    if (parseInt(tk).toString()==tk) return ;
    if (tk.slice(0,2)=='0x' && !isNaN(parseInt(tk.slice(2),16))) {
      return;
    } 
    if (tk[0]!=='(') this.lexicon.push([from,to,macro]);
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
  	this.skipBlank();
  	const start=this.ntib;
  	this.next();
  	const now=this.ntib;
  	this.ntib=mark;
  	return [start,now];
  }
  token(){
    return this.tib.slice(this.ptib,this.ntib);
  }
  next(noautobreak=false) {//codePointAt 能正確讀一個 UTF32 字元
    this.skipBlank();
    this.ptib=this.ntib;
    let ntib=this.ntib;
    const tib=this.tib;
    const ct=charType(tib.codePointAt(ntib));
    while (ntib<tib.length && tib.codePointAt(ntib)>0x20 ) {
        //if (tib.charAt(ntib)==';' && rawtoken.length) break // ; 必須在開頭
       	ntib++;
        const ct2=charType(tib.codePointAt(ntib));
      	if(ct2!=ct) break; 
    }

    if (!noautobreak) {
      const bestlen=this.breakat( this.ntib, ntib);
      if (bestlen>0) {
        this.ntib+=bestlen;
        return;
      }
    }
    this.ntib=ntib;
  }
  run(str:string, handlers:TokenHandler[]=[]) {
  	this.reset(str);
  	const out:[]=[];
  	const defaultHandler=handlers[''];
    this.skipComment();
    while (this.ntib<this.tib.length) {
      let blankstart=this.ntib;
      this.skipBlank();
      if (this.ntib>blankstart) {
      	 defaultHandler&&defaultHandler(this.tib.slice(blankstart,this.ntib),blankstart,this.ntib);
      }
      let start=this.ntib;
      this.next();
      this.skipComment();
      const handler=handlers[this.tib[this.ntib]];//use first character as selector
      let tk=this.tib.slice(start,this.ntib);

      if (this.macroReturn) {//in macro
        if (this.ntib>=this.macroEnd) {
          this.ntib=this.macroReturn;
          this.macroReturn=0;
        } else {
          tk=macroReplace.call(this,tk);
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
      if (handler&& handler(tk,start,this.ntib)) continue;
	    defaultHandler&&defaultHandler(tk,start,this.ntib);
    }
  }
}