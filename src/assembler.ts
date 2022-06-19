import {ModuleWriter,CodeWriter,TypeWriter,Var,one_one}   from './codegen.ts';
import {tokenize} from './tokenizer.ts';
import {parseParenthesis} from './parser.ts'
import {Instructions} from './instructions.ts';
const makeType=count=>{
	const types=new Array(count);
	return types.fill(Var.i32);
}
const invalidName=n=>{
	return !n || n[0]==='_' || n.endsWith('!') || n.endsWith(')') || n.endsWith('"');
}
export default class Assembler {
	constructor(){
		this.colonName='';
		this.colonType;
		this.paramCount=0;
		this.colonLocals=[];
	    this.symbols={};//已知的符號，未解析地址
		this._main=new CodeWriter();  //如果不在 : ; 之內，則編入 _main
		this.colonWriter=this._main;  //一開始就是編入_main ，一進入 : colonWriter 改為正在編的字，; 後就切回 _main
		this.moduleWriter=new ModuleWriter(); //生成WebAssembly 目的包 *.wasm 格式
	}
	assemble(buf:string){
		if (!buf.trim()) return;
		const tokens=tokenize(buf); //切分為執行單元
		let i=0;
		while (i<tokens.length) {
			let tk=tokens[i];
			if (tk[0]==':') {        //定義字
				if (this.colonName) {
					throw this.colonName+"word not finished yet "
				}
				this.colonName=tk.slice(1);
				if (this.symbols[this.colonName]) {
					throw "repeat defination "+this.colonName;
					return;
				}
				if (invalidName(this.colonName)) {
					throw "invalid name " +this.colonName;
					return;
				}
				this.symbols[this.colonName]=true;
				this.colonWriter=new CodeWriter(); 
				if (tokens[i+1][0]==='(') {
					const [locals,paramCount,resCount]=parseParenthesis(tokens[i+1]);
					this.colonLocals=locals;
					this.paramCount=paramCount;
					this.colonType= (new TypeWriter(makeType(paramCount),makeType(resCount)).write());
					i++;
					for (let j=0;j<paramCount;j++) {
						this.colonWriter.get_local(j); //push parameter on stack
					}
				}
			} else if (tk[0]==';') { //結束這個字，; 後面是 export 名
				const exportname=tk.slice(1);
				this.colonWriter.end();
				this.moduleWriter.addFunction(this.colonName,this.colonType ,this.colonWriter);
				exportname && this.moduleWriter.exportFunction(this.colonName, exportname);
				this.colonName='';
				this.colonWriter=this._main;
			} else if (tk[0]=='(') { //不在定義字後的只是註解
			} else {
				let assignment=false;
				if (tk[tk.length-1]=='!') {  //變數賦值
					assignment=true;
					tk=tk.slice(0,tk.length-1);
				}
				let localIndex=this.colonLocals.indexOf(tk);
				if (~localIndex) { //是參數或區域變數？
					//localIndex-=this.paramCount;
					if (assignment) {
						this.colonWriter.set_local(localIndex)
					} else {
						this.colonWriter.get_local(localIndex);							
					}
				} else if (Instructions[tk]) { //是否是內建指令
						const inst=this.colonWriter[ Instructions[tk]];
						if (inst) inst.apply(this.colonWriter);
				} else {
					if (parseInt(tk).toString()==tk) { //十進位數
						this.colonWriter.i32_const(parseInt(tk));
					} else if (tk.slice(0,2)=='0x' && '0x'+parseInt(tk,16).toString(16)==tk) { //十六進位數
						this.colonWriter.i32_const(parseInt(tk,16));
					} else {
						if (tk!=='_main') { //因為 js 會自動進入 _main ，不能重覆叫它
							this.colonWriter.call(tk); //token作為函式名，在codegen::resolveFunctionNames 會回填位址
						} else {
							throw "cannot call _main in forth program";
						}
					}
				}
			}
			i++;
		}
	}
	codeGen(){
		this._main.end(); //結束編譯 main ，必須留一個值在stack 上
		this.moduleWriter.addFunction("_main",one_one ,this._main); //_main internal name
		this.moduleWriter.exportFunction("_main","main"); //在js 的名字是main
		return this.moduleWriter.gen();
	}
}