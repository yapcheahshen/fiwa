export interface TTokenier {
	tib:string;
	ntib:number;
	lexicon: [number,number][];
	next():string;
	reset(tib):void;
	end():boolean;
}
export type TokenHandler={
	 (tk: string): boolean;
}
export type CountedString=[addr:number,cnt:number];
export enum CharType {
	blank=0;
	ascii=1;
	chinese=2;
	chinesepunc=3;
	unknown=4;
}
const charType:CharType=cp=>{
	if (cp<=0x20) return CharType.blank;
	if (cp<0x2000) {
		return CharType.ascii;
	} else if ((cp>=0x3400&&cp<=0x9fff) || (cp>=0xd800&&cp<=0xdcff )||(cp>=0xe000&&cp<=0xf9ff )) {
		return CharType.chinese;
	} else return CharType.blank;
}
export class Tokenizer {
  constructor (tib=''){
  	this.reset(tib);
  }
  reset(buf:string):void{
    this.tib=buf;
    this.ntib=0;
    this.lexicon=[];
  }
  end():boolean{
  	return ntib>=tib;
  }
  skip():void {
    let ntib=this.ntib;
    const tib=this.tib;
    if (tib[ntib]=='\\') {
      while ( ntib <tib.length && tib.codePointAt(ntib)>=0x20) ntib++;
      return this.next();
    } else if (tib[ntib]=='(') {
      while ( ntib <tib.length && tib.charAt(ntib)!==')') ntib++;
      ntib++; //skip )
      return this.next();
    } else return ;
    // console.log('comment',tib.slice(this.ntib,ntib));
    this.ntib=ntib;
  }
  skipBlank(){
  	let ntib=this.ntib;
  	while (this.tib.codePointAt(ntib)<=0x20) ntib++; //skip blank characters
  	this.ntib=ntib;
  }
  firstMatch(_from,_to):number{ //找第一個符合的
	const tofind=this.tib.slice(_from,_to);
  	for (let i=this.lexicon.length-1;i>=0;i--) {
  		const [from,to]=this.lexicon[i];
  		if (tofind.startsWith(this.tib.slice(from,to))) {
			return to-from;
  		}
  	}
  	return 0;
  }
  bestMatch(_from,_to):number {//找最長符合的
  	let bestlen=0;//this is slow ... speed up later
	const tofind=this.tib.slice(_from,_to);
  	for (let i=this.lexicon.length-1;i>=0;i--) {
  		const [from,to]=this.lexicon[i];
  		if (tofind.startsWith(this.tib.slice(from,to))) {
  			if (to-from>bestlen) {
  				bestlen=to-from;
  			}
  		}
  	}
  	return bestlen;
  }
  breakat(_from,_to):number{
  	const bestlen=this.bestMatch(_from,_to); //開頭最長符號
  	if (bestlen) return bestlen;
  	for (let i=_from+1;i<_to;i++) {
  		const at=this.firstMatch(i,_to); //最接近符合的
  		if (at>0) return i-_from;
  	}
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
  next() {//codePointAt 能正確讀一個 UTF32 字元
    this.skipBlank();
    let ntib=this.ntib;
    const tib=this.tib;
    const ct=charType(tib.codePointAt(ntib));
    while (ntib<tib.length && tib.codePointAt(ntib)>0x20 ) {
        //if (tib.charAt(ntib)==';' && rawtoken.length) break // ; 必須在開頭
       	ntib++;
        const ct2=charType(tib.codePointAt(ntib));
      	if(ct2!=ct) break; 
    }
    const bestlen=this.breakat( this.ntib, ntib);
    if (bestlen>0) {
    	this.ntib+=bestlen;
    } else {
    	this.ntib=ntib;
    }
  }
  run(str:string, handlers:TokenHandler[]=[]) {
  	this.reset(str);
  	const out:[]=[];
  	const defaultHandler=handlers[''];
    while (this.ntib<this.tib.length) {
      this.skipBlank();
      let start=this.ntib;
      this.next(false);
      this.skip();
      const handler=handlers[this.tib[this.ntib]];//use first character as selector
      const tk=this.tib.slice(start,this.ntib);
      if (handler&& handler(tk)) continue;
	  defaultHandler&&defaultHandler(tk);
	  this.lexicon.push([start,this.ntib]);
    }
  }
}