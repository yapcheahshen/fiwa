import { Var, CodeWriter,  ModuleWriter,  one_one,  makeSignature ,TypeWriter,  Var} from "./codegen.ts";
import { tokenize } from "./tokenizer.ts";
import { parseParenthesis } from "./parser.ts";
import { Instructions } from "./instructions.ts";
type bytecode = number;
const invalidName = (n:string) =>
  !n || n.startsWith("_") || n.startsWith("=") || n.endsWith(")") ||
  n.endsWith('"');
const makeType = (names:string[]) => names.map(() => Var.i32); //only i32

export default class Assembler {
  colonName: string;
  colonSignature: number[];
  colonParams:string[];
  colonLocals:string[]
  symbols: Map<string,boolean>;
  imports: Map<string,number>;
  _start : CodeWriter;
  colonWriter: CodeWriter;
  moduleWriter : ModuleWriter;
  opts :{};
  constructor(opts) {
  	this.imports=opts.imports|| {};
    this.opts=opts||{};
    this.colonName = "";
    this.colonSignature =[];
    this.colonParams = [];
    this.colonLocals = [];
    this.here        = 0 ; // string literals writing address, 
    this.symbols = {}; //已知的符號，未解析地址
    this._start = new CodeWriter([]); //如果不在 : ; 之內，則編入 _start
    this.colonWriter = this._start; //一開始就是編入_start ，一進入 : colonWriter 改為正在編的字，; 後就切回 _start
    //生成WebAssembly 目的包 *.wasm 格式
    this.moduleWriter = new ModuleWriter({ memory: opts.memory || 1 }); //配置memory*64KB ，0或都表示至少配64KB
  }
  colon(tk:string, nexttk:string): number {
    let skip = 0;
    if (this.colonName) {
      throw this.colonName + "word not finished yet ";
    }
    this.colonName = tk.slice(1);
    if (this.symbols[this.colonName]) {
      throw "repeat defination " + this.colonName;
    }
    if (invalidName(this.colonName)) {
      throw "invalid name " + this.colonName;
    }
    this.symbols[this.colonName] = true;
    let params : string[]=[], locals : string[]=[], resultsType :bytecode[]=[];
    if (nexttk[0] === "(") { //最好有，沒有的話 就是 ( a -- 1 ) 一進一出
      [params, locals, resultsType] = parseParenthesis(nexttk);
      skip++;
    }
    this.colonParams = params;
    this.colonLocals = locals;
    this.colonWriter = new CodeWriter(makeType(locals));
    this.colonWriter.setName(this.colonName);
    this.colonSignature = new TypeWriter(makeType(params), resultsType).write(); //函式的簽名

    //參數只有序號 $0  , 自動 push 到 stack
    if (params.length&&params.length==params.filter(it=>it[0]=='$').length) {
	    for (let j = 0; j < params.length; j++) {
	      this.colonWriter.get_local(j); //push parameter on stack
	    }
	}
    return skip;
  }
  semicolon(tk:string): void {
    const exportname = tk.slice(1);
    this.colonWriter.end();
    this.moduleWriter.addFunction(
      this.colonName,
      this.colonSignature,
      this.colonWriter,
    );
    if (exportname) {
      this.moduleWriter.exportFunction(this.colonName, exportname);
    }
    this.colonName = "";
    this.colonWriter = this._start;
  }
  tryLit(tk:string): void {
  	if (tk[0]=='"') { //a string literal, 
  		let s=tk.slice(1);
  		if (s[s.length-1]=='"') s=s.slice(0,s.length-1);
  		this.colonWriter.i32_const(this.here);
  		this.here= this.moduleWriter.addString(this.here, s) ;
  	} else if (parseInt(tk).toString() == tk) { //十進位數
    	this.colonWriter.i32_const(parseInt(tk));
    } else if (
    	tk.slice(0, 2) == "0x" && "0x" + parseInt(tk, 16).toString(16) == tk) { //十六進位數
    	this.colonWriter.i32_const(parseInt(tk, 16));
    } else {
    	if (tk !== "_start") { //因為 js 會自動進入 _start ，不能重覆叫它
        	this.colonWriter.call(tk); //token作為函式名，在codegen::resolveFunctionNames 會回填位址
      	} else {
            throw "cannot call _start in forth program";
        }
    }
  }
  tryVariables(tk:string): boolean {
    let assignment = false;
    if (!Instructions[tk] && tk[0] == "=") { //變數賦值
      assignment = true;
      tk = tk.slice(1);
    }

    let paramIndex = -1;

    let localIndex = -1;
    if (tk[0]=='$' && parseInt(tk.slice(1)).toString()==tk.slice(1)) {
    	paramIndex=parseInt(tk.slice(1));
    } else {
	    paramIndex=this.colonParams.indexOf(tk);
	    if (paramIndex==-1) localIndex=this.colonLocals.indexOf(tk);
    }

    if (~paramIndex || ~localIndex) { //是參數或區域變數？
      let idx = paramIndex;
      if (~localIndex) {
        idx = this.colonParams.length + localIndex; //local vars 的index要加上 params count
      }
      if (assignment) { //變數賦值
        this.colonWriter.set_local(idx);
      } else {
        this.colonWriter.get_local(idx);
      }
      return true;
    }
    return false;
  }
  assemble(buf: string) {
    if (!buf.trim()) return;
    const tokens = tokenize(buf); //切分為執行單元
    let i = 0;
    while (i < tokens.length) {
      let tk = tokens[i];
      if (tk[0] == ":") { //定義字
        i += this.colon(tk, tokens[i + 1]);
      } else if (tk[0] == ";") { //結束這個字，; 後面是 export 名
        this.semicolon(tk);
      } else if (tk[0] == "(") { //不在定義字後的只是註解
      } else {
        if (!this.tryVariables(tk)) {
          if (Instructions[tk]) { //是否是內建指令
            const inst = this.colonWriter[Instructions[tk]];
            if (inst) inst.apply(this.colonWriter);
          } else {
            this.tryLit(tk);
          }
        }
      }
      i++;
    }
  }
  codeGen() {
  	for (let name in this.imports) {
  		const signature=makeSignature(this.imports[name],1);//make a signature  
  		this.moduleWriter.importFunction(name, signature, 'js', name)
  	}
    this._start.end(); //結束編譯 main ，必須留一個值在stack 上
    this.moduleWriter.addFunction("_start", makeSignature(2,1) , this._start); //_start internal name
    this.moduleWriter.exportFunction("_start", "_start"); //在js 的名字是main
    return this.moduleWriter.gen({datasize:this.here , ...this.opts});
  }
}
