import { ModuleWriter } from "./modwriter.ts";
import { CodeWriter} from './codewriter.ts';
import { ColonContext, doColon , doSemiColon } from "./colon.ts";
import { doGlobal, doVar } from "./variable.ts";
import { doLit } from "./literal.ts";
import { START } from "./constants.ts"
import { makeSignature} from "./writers.ts"
import { Tokenizer ,TokenBreaker} from "./tokenizer.ts"
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
  here:number;                     //memory pointer
  assemble(buf: string):void;
  breaker:TokenBreaker;
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
    this.here= 0 ;
    this.prolog();
  }
  private breaker(str):number{ //匹配最長的字
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
  scan(buf: string):void {
    const tokenizer=new Tokenizer(buf);
    while (!tokenizer.end()) {
      let tk=tokenizer.next(false,this.breaker.bind(this));
      this.opts.callbacks?.token&&this.opts.callbacks.token(tk);
      tk=tokenizer.skip(tk);
      if (tk[0] === ':')         doColon.call(this,tk);
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