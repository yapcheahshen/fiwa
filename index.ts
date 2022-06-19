/* runs on browser only*/
import {ModuleWriter,CodeWriter,TypeWriter,Var}   from './src/codegen.ts';
import Assembler from './src/assembler.ts';
export class Fiwa {
	constructor ({boot,onError,onLog}) {
		this.boot=boot;
		if (typeof this.boot=='string') this.boot=[this.boot];
		this.onError=onError;
		this.onLog=onLog;
		this.imports={};
	}
	async execute(buf,arg){
		const A=new Assembler();
		try{
			this.boot.forEach(bootcode=>A.assemble(bootcode));
			A.assemble(buf);
			const byteCode=A.codeGen(); 
		    const {instance}=await WebAssembly.instantiate(byteCode,this.imports);
		    if (instance.exports.main) { //定義了 main
		    	const ret=instance.exports.main(arg);
		    	this.onLog&&this.onLog('>'+ret);
		    }
		    return instance.exports;	
		} catch(e){
			this.setError(e)
		}
	}
	setError(e) {
		this.onError&&this.onError(e);
	}
}
export default Fiwa;
if (typeof window!=='undefined') window.Fiwa=Fiwa;