import {parseParenthesis } from "./parser.ts";
import {validForthName} from "./utils.ts";
import {CodeWriter} from "./codegen.ts"
import {START,bytecode,Var} from "./constants.ts";
import {TypeWriter} from "./writers.ts";
import {parseSignature,makeType} from "./signature.ts"
export const makeType = (names:string[]) => names.map(() => Var.i32); //only i32
export interface WordContext {name:string,params:string[],locals:string[],signature:bytecode[] }
  
export function doColon(tk:string=''):void{
  if (this.word!==START)     throw " word not finished yet";

  const name=this.nextToken();
  if (this.words[name])      throw "repeat defination " + name;
  if (!validForthName(name)) throw "invalid name " + name;
  
  let params:string[]=[],locals:string[]=[];
  const paren=this.nextToken(true);
  if (paren[0] === "(") { //最好要定義清楚，預設是( 0 -- 0 )
    this.nextToken();
    [params,locals,resultsType]=parseSignature.call(this,paren) ;
  }
  const signature = new TypeWriter(makeType(params), resultsType).write(); //函式的簽名

  this.word = name;
  this.words[name] = {name, params, locals, signature};

  this.colonWriter = new CodeWriter(makeType(locals));
  this.colonWriter.setName(name);

  //無命名參數, 自動 push 到 stack
  if (params.length&&params.length==params.filter(it=>it[0]=='$').length) {
    for (let j = 0; j < params.length; j++) {
      this.colonWriter.get_local(j); //push parameter on stack
    }
	}
}
export function doSemiColon(tk:string=''):void{
  if (this.word===START) throw "not inside colon "+tk;
  const exportname = tk.slice(1);
  this.colonWriter.end();
  const {name,signature}=this.compiling();
  this.moduleWriter.addFunction( name,signature, this.colonWriter);
  if (exportname) {
    this.moduleWriter.exportFunction(this.colonName, exportname);
  }
  this.word=START;
  this.colonWriter = this.startWriter;
}