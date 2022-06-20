/* runs on browser only*/
import {ModuleWriter,CodeWriter,TypeWriter,Var}   from './src/codegen.ts';
import Assembler from './src/assembler.ts';
import {ztype,dot} from './src/js4forth.ts';
import {bundleWasm} from './src/wasm.ts'
export class Fiwa {
	byteCodes: Uint8Array;
	constructor ({boot,onError,onLog,memory,exportMem=false}) {
		this.boot=boot;
		if (typeof this.boot=='string') this.boot=[this.boot];
		this.onError=onError;
		this.onLog=onLog;
		this._mem = new WebAssembly.Memory({initial:1});
		this.imports={	env:{ztype: ztype.bind(this) , _mem:this._mem, ".":dot.bind(this)}};
		this.exportMem=exportMem||false;
		this.byteCodes=[];
		this.memory=memory||10 //maximum 640 kB, minimum is 64KB
	}
	async instantiate(byteCodes,arg,imports) {
		try {
		    const wa=await WebAssembly.instantiate(byteCodes,this.imports);
		    
		    if (wa.instance.exports._start) { //定義了 _start
		    	const ret=wa.instance.exports._start(arg);
		    	this.onLog&&this.onLog('⏎'+ret, true);
		    }
		    //this._mem=wa.instance.exports._mem;
		    //console.log('mem',this._mem)
		    return wa.instance.exports;

		} catch(e) {
			this.setError('instantiate:'+e)
		}

	}
	async execute(buf,arg){
		const A=new Assembler({_mem:this._mem, exportMem:this.exportMem,imports:{ztype:[1,0],".":[1,0]}})
		try{
			this.boot.forEach(bootcode=>A.assemble(bootcode));
			A.assemble(buf);
			const byteCodes=A.codeGen(); 
			const r=this.instantiate(byteCodes, arg, this.imports );
			this.byteCodes=byteCodes; //update if successful
			return r;
		} catch(e){
			this.setError('assemble:'+e)
		}
	}
	async bundle(){//bundle

	}
	setError(e) {
		this.onError&&this.onError(e);
	}
}
export default Fiwa;
if (typeof window!=='undefined') window.Fiwa=Fiwa;