import { ModuleWriter } from "./modwriter.ts";
import { CodeWriter} from './codewriter.ts';
import { ColonContext, doColon , doSemiColon } from "./colon.ts";
import { doGlobal, doVar } from "./variable.ts";
import { doLit } from "./literal.ts";
import { START } from "./constants.ts"
import { makeSignature} from "./writers.ts"
interface FiwaAssembler { 
  opts :{};
  moduleWriter : ModuleWriter;
  imports: Map<string,number>;     //imports from runtime
  colonWriter:   CodeWriter;       //current compiling forth word
  startWriter :CodeWriter;              //wasm entry function, like main in C
  done:boolean;
  globals:Map<string,boolean>;     //global variables
  words  :Map<string, WordContext>;//defined and defining words
  word:string;                     //the word being compiled, empty if in main
  private tib:string;              //terminal input buffer
  private ntib:number;             //tib pointer
  here:number;                     //memory pointer
  assemble(buf: string):void;
  getContext():Map;
  genByteCode():void;
}
export default class Assembler implements FiwaAssembler {
  constructor(opts) {
    this.opts=opts||{};
  	this.imports=this.opts.imports|| {};
    this.words = {};                   //已知的符號，未解析地址
    this.word  = START;                //正在編的字
    this.globals={};                   //Global Varibles and Constants
    this.startWriter = new CodeWriter([]);  //如果不在 : ; 之內，則編入 _start
    this.colonWriter = this.startWriter;    //一開始就是編入_start ，一進入 : colonWriter 改為正在編的字，; 後就切回 _start
    this.moduleWriter = new ModuleWriter(); //{ memory: opts.memory || 1 }外部配置memory*64KB ，0或都表示至少配64KB    
    this.tib='';
    this.ntib=0;
    this.here= 0 ;
    this.prolog();
  }
  private bestMatch(str){ //匹配最長的字
    let best='';
    const chi= str.codePointAt(0)>0x3400;
    if (chi) {
      for (let w in this.words) {
        if (str.startsWith(w)) {
           if (w.length>best) best=w;
        }
      }
      return best?best.length:1;      
    } else {
      let i=1;
      while (i<str.length) {
        if (str.codePointAt(i)<0x7f && str.charAt(i)!==';') i++;
        else break;
      }
      return i;
    }
  }
  protected nextToken(peek=false, autobreak=false):string {//codePointAt 能正確讀一個 UTF32 字元
    let rawtoken="", ntib=this.ntib;
    const tib=this.tib;
    while (tib.codePointAt(ntib)<=0x20) ntib++; //skip blank characters
    while (ntib<tib.length && tib.codePointAt(ntib)>0x20 ) {
      if (tib.charAt(ntib)==';' && rawtoken.length) break // ; 必須在開頭
      rawtoken+=String.fromCodePoint(tib.codePointAt(ntib++));
    }
    let token=rawtoken;
    if (autobreak) { //chinese tokens, break into small units
      const n=this.bestMatch(rawtoken);
      token=rawtoken.slice(0,n);
      ntib -= (rawtoken.length-n);
    }
    if (!peek) this.ntib=ntib;
    return token;
  }
  private skipComment(tk):void {
    let ntib=this.ntib;
    const tib=this.tib;
    if (tk[0]=='\\') {
      while ( ntib <tib.length && tib.codePointAt(ntib)>=0x20) ntib++;
    } else if (tk[0]=='(') {
      while ( ntib <tib.length && tib.charAt(ntib)!==')') ntib++;
      ntib++; //skip )
    } // console.log('comment',tib.slice(this.ntib,ntib));
    this.ntib=ntib;
  }
  private prolog(){
    const signature = makeSignature(3,1) ; //_start 可以傳入3個參數。一個返回值
    this.word=START;
    this.words[START]={name:START, params:['$0','$1','$2'], locals:['i','j','k'] , signature};
  }
  private epilog(){
    if (this.word!==START) doSemiColon.call(this);//強制結束
    this.word=START;
    this.startWriter.end(); //結束編譯 main ，必須留一個值在stack 上
    const {signature}=this.compiling();
    this.moduleWriter.addFunction(START, signature, this.startWriter); //_start internal name
    this.moduleWriter.exportFunction(START, START); //在js 的名字是main
  }
  compiling():WordContext{
    return this.words[this.word];
  }
  setTib(buf:string):void{
    this.tib=buf;
    this.ntib=0;
  }
  scan(buf: string):void {
    this.setTib(buf);
    while (this.ntib<this.tib.length) {
      const tk=this.nextToken(false,true);
      this.opts.callbacks?.token&&this.opts.callbacks.token(tk);
      if (tk[0]==='('||tk[0]==='\\')  this.skipComment(tk);
      else if (tk[0] === ':')         doColon.call(this,tk);
      else if (tk[0]===';')         doSemiColon.call(this,tk);
      else doVar.call(this,tk) ||     doLit.call(this,tk)
    }
  }
  getContext():Map{
    return {here:this.here};
  }
  genByteCode():void {
    if (this.opts._mem) {
      this.moduleWriter.importMemory('_mem','env');
    }
    for (let name in this.imports) {
      const signature=makeSignature(...this.imports[name]);//make a signature  
      this.moduleWriter.importFunction(name, signature, 'js', name); 
    } 
    this.epilog(); //epilog 之後再叫 assemble 會出錯，讓 codeGen 報錯，Assembler 不檢查。
    return this.moduleWriter.gen({datasize:this.here , ...this.opts});
  }
}